import React from 'react';
import './Dashboard.css';
import ChatroomCreate from '../Search/ChatroomCreate';
import ChatroomSearch from '../Search/ChatroomSearch';  
import { useHistory } from 'react-router-dom';
import { roomSearch, createRoom } from '../../room-helpers/roomhelper';

const Dashboard = ({socket, user, setChatrooms, setCreatedRooms, subscribeToChatroom, roomClickHandler }) =>{
  const history = useHistory()

  const handleRoomSearch = async (roomCreator, roomName) => {
    const rooms = await roomSearch(roomCreator, roomName)
    history.push('/search', {
      chatrooms: rooms
    })  
  }

  const handleRoomCreate = async (input) =>{
    try{
      const newRoom = {
        creator_id: user.id,
        creator_name: user.username,
        room_name: input,
        }
        const room = await createRoom(newRoom);
        if (room === 'Room already exists'){
          alert('Room already exists')
        }
        else if (room){
          socket.emit('create room', room.name, room.creator_name)
          setCreatedRooms((chatrooms) => [...chatrooms, room])
        } else {
            alert('Could not create room')  
        }  
    } catch (err){
      console.log(err)
    }
  }


  if (!user){
    return null;
  } else return (
        <div className='dashboard-container animate__animated animate__fadeIn'>
            <p className='user-heading'>Logged in as {user.username}</p>
            <div className='columns is-centered section'>
              <div className='column is-three-quarters'>
              <ChatroomCreate
                setChatrooms={setChatrooms}
                handleRoomCreate={handleRoomCreate}
              />
              </div>
            </div>
            <div className='columns is-centered section'>
              <div className='column is-three-quarters'>
              <ChatroomSearch
                subscribeToChatroom={subscribeToChatroom} 
                handleRoomSearch={handleRoomSearch}
              />
              </div>
              </div>
            </div>
    );
  
}

export default Dashboard;