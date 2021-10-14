import React, { useEffect, useState } from 'react';
import ChatWindow from './components/ChatWindow/ChatWindow';
import Chatrooms from './components/Chatrooms/Chatrooms';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';
import {  Router,
          Switch,
          Route,
} from 'react-router-dom';
import history from './history';
import socket from './socket/socket';
import {
          deleteRoom, 
          deleteSubscription,
          subscribe,
          getUserRooms,
          getSubscribedRooms
} from './room-helpers/roomhelper'

const App = () => {
  
  const [chatrooms, setChatrooms] = useState([]);
  const [createdRooms, setCreatedRooms] = useState([])
  const [user, setUser] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)

  useEffect(()=> {
    socket.on('room create failed', () => {
      alert('failed to create room');
    });

    socket.on('room create success', (room, roomCreator)=> {
      history.push('dashboard');
      alert('Successfully Created Room');
    });
    
    socket.on('enter success', (roomName, roomCreator, roomId) => {
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

    return () => socket.removeAllListeners()
  })

const subscribeToChatroom = async (room) => {
    let foundRoom = chatrooms.filter((r) => r.chatroom_id === room.chatroom_id); 
    if (foundRoom.length === 0){
      const newRoom = await subscribe(room.chatroom_id, user.id)
      if (newRoom){
        alert('You have successfully subscribed to ' + newRoom.name + '!');
        setChatrooms(chatrooms => [...chatrooms, newRoom])
      } else {
        alert('Already subscribed to room!')
      }
    } else {
      alert('Already subscribed to room!')
    }
  }

const enterChatroom = async (room) => {
  try {
    if (!chatrooms.find(r => r.chatroom_id === room.chatroom_id)){
      await subscribe(room.chatroom_id, user.id)
      setChatrooms(chatrooms => [...chatrooms, room])
    }
    setCurrentRoom(room)
    socket.emit('enter', room.name, room.creator_id, room.chatroom_id)
    } catch(err){
      console.log(err)
    }    
}

  const deleteChatroom = async (roomId) => {
   try {
      deleteRoom(roomId)
      const updatedInbox = chatrooms.filter(room => {
      return room.chatroom_id !== roomId
    })
      const updatedRooms = createdRooms.filter(room => {
        return room.chatroom_id !== roomId
      })

      alert('Room deleted')
      setChatrooms(updatedInbox)
      setCreatedRooms(updatedRooms)
    } catch(err) {
      console.log(err);
    }
  }

  const deleteSubscriptionHandler = async (roomId) =>{
    try {
      await deleteSubscription(roomId, user.id)
      const updatedRooms = chatrooms.filter((room) => {
        return room.chatroom_id !== roomId;
      });
      setChatrooms(updatedRooms)
      alert('unsubscibed')
    } catch (err) {
      console.log(err)
    } 
  }

  const exitChatroom = (name) =>{
    socket.emit('exit', name);
    setCurrentRoom(null)
  }


  const loadUser = async (user) => {
    setUser(user)
    const subscribedRooms = await getSubscribedRooms(user.id)
    const userCreatedRooms = await getUserRooms(user.id)
    setChatrooms(subscribedRooms)
    setCreatedRooms(userCreatedRooms)
  }

  const logOut = () => {
    setUser(null)
    setChatrooms([])
    setCreatedRooms([])
    setCurrentRoom(null)
    history.push('/');
  }
  
  return (
      <Router history={history}>
      <div className='App'>
        <NavBar 
          user={user}
          logOut={logOut}
        />
        <Switch>
        
        <Route 
          exact path='/chat' 
          render={(props) =>
            <ChatWindow
              user={user}
              chatroom={currentRoom}
              socket={socket}
              exitChatroom={exitChatroom}
            />
          }
        />

        <Route 
          exact path='/' 
          render={(props) => <Home user={user}/>}
        />

        <Route 
          exact path='/inbox' 
          render={(props) =>
            <Chatrooms
            chatrooms={chatrooms}
            roomClickHandler={enterChatroom}  
            deleteRoomHandler={deleteSubscriptionHandler} 
            />
          }
        />

        <Route 
          exact path='/manage' 
          render={(props) =>
            <Chatrooms
              roomClickHandler={enterChatroom} 
              chatrooms={createdRooms}
              deleteRoomHandler={deleteChatroom} 
            />
          }
        />

        <Route
         exact path='/dashboard'
          render={(props) =>
            <Dashboard
              socket={socket} 
              user={user}
              setChatrooms={setChatrooms} 
              setCreatedRooms={setCreatedRooms}
              roomClickHandler={subscribeToChatroom}
            /> 
          }
        />

        <Route
         exact path='/search'
          render={(props) =>
           <Chatrooms
              roomClickHandler={subscribeToChatroom} 
              chatrooms={props.location.state.chatrooms}
              deleteRoomHandler={null} 
            />
          }
        />

        <Route
         exact path='/login'
          render={(props) =>
            <Login
              loadUser={loadUser}
            />
          }
        />

        <Route
          exact path='/register'
          render={(props) => 
            <Register
            loadUser={loadUser}
              />
          }
        />

      </Switch>
      </div>
      </Router>
    );
}

export default App;
