import React, {useState} from 'react';
import { handleInputChange } from '../../room-helpers/roomhelper';
import './ChatroomMenu.css';

const ChatroomSearch = ({handleRoomSearch}) => {
  const [roomNameInput, setRoomNameInput] = useState('')
  const [roomCreatorInput, setRoomCreatorInput] = useState('')

  const searchRoom = (event) => {
    event.preventDefault()
    handleRoomSearch(roomCreatorInput, roomNameInput)
  }
  
    return (
        <div className='white-card box inner-pad'>
          <h1 className='card-title'>Search for Chatroom</h1>
          <form onSubmit={searchRoom}>
            <div className='field'>
              <label>
                <span className='input-label'>Room Name</span>
              </label>
              <div className='control'>
                <input className='input' type='text' value={roomNameInput} onChange={(event)=> handleInputChange(event, setRoomNameInput)} required/>
              </div>
            </div>
            <label>
              Room Admin
              <input className='input' type='text' value={roomCreatorInput} onChange={(event) => handleInputChange(event, setRoomCreatorInput)} required/>
            </label>
                <input className='button' type='submit' value='Search'/>
            </form>
          </div>
    );
}

export default ChatroomSearch;