import React, { Component } from 'react';
import ChatWindow from './components/ChatWindow/ChatWindow';
import Chatrooms from './components/Chatrooms/Chatrooms';
import ChatroomSearch from './components/Search/ChatroomSearch';
import ChatroomCreate from './components/Search/ChatroomCreate';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import io from 'socket.io-client';
import './App.css';
import {  Router,
          Switch,
          Route,
} from 'react-router-dom';
import history from './history';

let socket;

class App extends Component {
    constructor(){
    super();
    this.state = {
      inRoom: false,
      user: '',
      currentRoom: '',
      searchChatResults: [],
      roomSearchInput : '',
      roomCreateInput: '',
      roomCreatorInput: '',
      messageList: [

      ],
      endpoint: "/sockets"  
    }

    socket = io('', { path : "/sockets", })

    this.deleteChatroom = this.deleteChatroom.bind(this);
  }

  subscribeToChatroom = (room, roomCreator, roomId) => {
    let foundRoom = this.state.user.chatrooms.filter((room) => room.chatroom_id === roomId); 
    
    if (foundRoom.length !== 0){
      this.setState({
        currentRoom: foundRoom,
        searchChatResults: '' 
      });
      history.push('/chatrooms');
      return;
    }
    
    fetch(`/chatrooms/${roomId}/subscriptions`,  {
            method : 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                'user_id': this.state.user.id,
                'user_chatrooms': this.state.user.chatrooms
            })
          }).then(res => {
              let newRoom = {};
              newRoom.name = room;
              newRoom['creator'] = roomCreator;
              newRoom['chatroom_id'] = roomId;

              let updatedUser = this.state.user;
              let userRooms = this.state.user.chatrooms;
              userRooms.push(newRoom);
              updatedUser['chatrooms'] = userRooms;

              this.setState({
              user: updatedUser,
              currentRoom: newRoom,
              searchChatResults: '' 
            });

              history.push('/chatrooms');
              alert('You have successfully subscribed to ' + room + '!');
          }).catch(err => console.log(err));
  }

  enterChatroom = (room, roomCreator, roomId) => {
            fetch(`/chatrooms/${roomId}/messages`,  {
              method : 'GET',
              headers: {'Content-Type' : 'application/json'},
            }).then(res => res.json())
            .then(messages => {
              let arr = messages.map(msg => msg);
              let updatedRoom = {
                "name": room,
                "creator": roomCreator,
                "id": roomId
              };

              this.setState({
                currentRoom: updatedRoom,
                messageList : arr
              });

              socket.emit('enter', room, roomCreator, roomId);
            })
            .catch(err => {
              console.log(err);
            })      
  }

  componentDidMount(){

    socket.on('chat message', (msg) => {
        let currentMessageList = [msg, ...this.state.messageList];
          
        this.setState({
          input : '', 
          messageList : currentMessageList 
        });
    });

    socket.on('room create failed', () => {
      alert('failed to create room');
    });

    socket.on('room create success', (room, roomCreator)=> {
      history.push('dashboard');
      alert('Successfully Created Room');
    });
    
    socket.on('enter success', (roomName, roomCreator, roomId) => {
        this.setState({
        inRoom: true,
      });

        history.push('/chat');
    });

    socket.on('enter failure', ()=> {
      history.push('/dashboard');
      alert('failed to enter room');
    });

    socket.on('subscribe failed', () => {
      history.push('/dashboard');
      alert('failed to subscribe to room');
    });
  }

  componentWillUnmount(){
  }

  async deleteChatroom (roomId) {
   try {
      await Promise.all([
        //delete all user subscriptions to chatroom
        fetch(`/chatrooms/${roomId}/subscriptions`,  {
                method : 'DELETE',
                headers: {'Content-Type' : 'application/json'},
        }),

        //delete all chatroom messages
        fetch(`/chatrooms/${roomId}/messages`,  {
                method : 'DELETE',
                headers: {'Content-Type' : 'application/json'},
        }),

        //delete chatroom
        fetch(`/chatrooms/${roomId}`,  {
                method : 'DELETE',
                headers: {'Content-Type' : 'application/json'},
        })
      ]);

        let updatedUser = this.state.user;
        let newRooms = this.state.user.created_rooms.filter((room) => { 
          return room.chatroom_id !== roomId;
        });

        let updatedInbox = this.state.user.chatrooms.filter((room) => { 
          return room.chatroom_id !== roomId;
        });

        updatedUser['created_rooms'] = newRooms;
        updatedUser['chatrooms'] = updatedInbox;

        this.setState({
          user: updatedUser
        });

        history.push('/manage');
      }
      catch(err) {
        console.log(err);
      }
  }

  deleteChatroomSubscription = (roomId) =>{

     fetch(`/users/${this.state.user.id}/subscriptions/chatrooms/${roomId}`,  {
              method : 'DELETE',
              headers: {'Content-Type' : 'application/json'},
      })
     .then(() => {
        let updatedUser = this.state.user;
        let newRooms = this.state.user.chatrooms.filter((room) => { 
          return room.chatroom_id !== roomId;
        });

        updatedUser['chatrooms'] = newRooms;

        this.setState({
          user: updatedUser
        });

        history.redirect('/chatrooms');
     })
      .catch(err => {
        console.log(err);
      });
  }

  exitChatroom = () =>{
    socket.emit('exit', this.state.currentRoom.name);
    this.setState({
      inRoom: false,
      currentRoom: '',
      messageList: []
    });
  }


  submitHandler = (event) => { 
      event.preventDefault();
      if (this.state.input === '') return;
      //post message to db then emit
      const timestamp = Date.now()
      fetch(`/chatrooms/${this.state.currentRoom.id}/messages`,  {
          method : 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
              "id": this.state.user.id, 
              "chatroom_id": this.state.currentRoom.id,
              "message": this.state.input, 
              "timestamp": timestamp, 
          })
        })
       .catch(err => {
          console.log(err);
       });

      socket.emit('chat message', this.state.user.username, this.state.input, this.state.currentRoom.name, timestamp);
  }

  onInputChange = (event) => {
    event.preventDefault();
    if (event.keyCode === 13){
      let currentMessageList = this.state.messageList; 
      currentMessageList.push(event.target.value);
      this.setState({
        input: "",
        messageList : currentMessageList  
      });
    } else {
        this.setState ({
          input: event.target.value
        });
    }
  }

  roomSearch = (event) => {
    event.preventDefault();
     fetch(`/users/${this.state.roomCreatorInput}/chatrooms/${this.state.roomSearchInput}`,  {
          method : 'GET',
          headers: {'Content-Type' : 'application/json'},
      })
     .then(res => res.json())
     .then(data => {
        let room = {
          "name": this.state.roomSearchInput,
          "creator": this.state.roomCreatorInput,
          "chatroom_id": data.chatroom_id,
        };

        let results = [];

        results.push(room);
        this.setState({
          searchChatResults: results,
          roomSearchInput: '',
          roomCreatorInput: ''
        });
     })
     .then(history.push('/search'))
     .catch((err) => {
        console.log(err);
     })
  }

  joinRoom = (room, creator) => {
    socket.emit('join', room, creator);
  }

  roomCreate = (event) => {
    event.preventDefault();
    fetch(`/users/${this.state.user.id}/chatrooms`,  {
          method : 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
              'chatroom_name': this.state.roomCreateInput,
              'creator': this.state.user.username,
              'user_id': this.state.user.id,
              'user_chatrooms': this.state.user.chatrooms
          })
      })
     .then(res => res.json())
     .then(room => {
        
          let updatedUser = this.state.user;
          room['creator_id'] = this.state.user.id;
          room['creator'] = this.state.user.username;

          let updatedInbox = [...this.state.user.chatrooms, room]
          let updatedChatrooms = [...this.state.user.created_rooms, room];
          updatedUser['chatrooms'] = updatedInbox;
          updatedUser['created_rooms'] = updatedChatrooms;

          this.setState({
            user: updatedUser,
            currentRoom: this.state.room,
          }); 
          socket.emit('create room', this.state.roomCreateInput, this.state.user.username);
     })
     .catch(err => console.log(err));
  }

  handleRoomNameChange = (event) =>{
    this.setState({
      roomSearchInput: event.target.value
    });
  }

  handleCreateRoomNameChange = (event) => {
    event.preventDefault();
    this.setState({
      roomCreateInput: event.target.value
    });
  }

  handleRoomCreatorChange = (event) => {
    this.setState({
      roomCreatorInput: event.target.value
    });
  }

  loadUser = (data) => {
    const user = {
          id: data.id,
          username: data.username
    };

    this.setState({
        user: user
    });
  }

  loadChatrooms = (chatrooms, createdRooms) => {
    let updatedUser = this.state.user;
    updatedUser['chatrooms'] = chatrooms;
    updatedUser['created_rooms'] = createdRooms;
    this.setState({
      user : updatedUser,
    });
  }

  redirect = (route) => {
    history.push(route);
  }

  logOut = () => {
    this.setState({
      inRoom: false,
      user: '',
      searchChatResults: [],
      roomSearchInput : '',
      roomCreateInput: '',
      roomCreatorInput: '',
      currentRoom: '',
      messageList: [

      ],
    });
    history.push('/');
  }

  render(){
    return (
      <Router history={history}>
      <div className='App'>
        <NavBar 
          user={this.state.user}
          logOut={this.logOut}
        />
        <Switch>
        
        <Route 
          exact path='/chat' 
          render={(props) =>
            <ChatWindow
              user={this.state.user}
              joinRoom={this.joinRoom}
              chatroomName={this.state.currentRoom.name}
              chatroomCreator={this.state.currentRoom.created_by}
              chatroomId={this.state.currentRoom.id}
              enterChatroom={this.enterChatroom}
              exitChatroom={this.exitChatroom} 
              inputChangeHandler={this.onInputChange} 
              messageList={this.state.messageList} 
              inputFieldContents={this.state.input}
              submitHandler={this.submitHandler}
            />}
        />

        <Route 
          exact path='/' 
          render={(props) =>
            <Home
              state={this.state}
              user={this.state.user}
            />
          }
        />

        <Route 
          exact path='/chatrooms' 
          render={(props) =>
            <Chatrooms
              roomClickHandler={this.enterChatroom} 
              rooms={this.state.user.chatrooms}
              state={this.state}
              deleteRoomHandler={this.deleteChatroomSubscription} 
            />
          }
        />

        <Route 
          exact path='/manage' 
          render={(props) =>
            <Chatrooms
              roomClickHandler={this.enterChatroom} 
              rooms={this.state.user.created_rooms}
              state={this.state}
              deleteRoomHandler={this.deleteChatroom} 
            />
          }
        />

        <Route
         exact path='/dashboard'
          render={(props) => 
            <div className='dashboard-container'>
            <div className='columns is-centered section'>
              <div className='column is-half'>
              <ChatroomCreate
                state={this.state}
                redirect={this.redirect}
                handleRoomCreateSubmit={this.roomCreate} 
                roomCreateInput={this.state.roomCreateInput}
                handleCreateRoomNameChange={this.handleCreateRoomNameChange}
              />
              </div>
            </div>
            <div className='columns is-centered section'>
              <div className='column is-half'>
              <ChatroomSearch 
                handleRoomSearchSubmit={this.roomSearch} 
                roomNameInput={this.state.roomSearchInput}
                roomCreatorInput={this.state.roomCreatorInput}
                handleRoomNameChange={this.handleRoomNameChange}
                handleRoomCreatorChange={this.handleRoomCreatorChange}
              />
              </div>
              </div>
            </div>
          }
        />

        <Route
         exact path='/search'
          render={(props) =>
            <Chatrooms
              roomClickHandler={this.subscribeToChatroom}
              deleteRoomHandler={()=>{}} 
              rooms={this.state.searchChatResults}
              state={this.state} 
            />
          }
        />

        <Route
         exact path='/login'
          render={(props) =>
            <Login
              loadUser={this.loadUser}
              loadChatrooms={this.loadChatrooms}
              redirect={this.redirect}
            />
          }
        />

        <Route
          exact path='/register'
          render={(props) => 
            <Register
              loadUser={this.loadUser}
              loadChatrooms={this.loadChatrooms}
              redirect={this.redirect}
              />
          }
        />

      </Switch>
      </div>
      <Footer/>
      </Router>
    );
  }
}
export default App;
