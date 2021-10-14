import React, { useState } from 'react';
import './ChatroomMenu.css';  
import { handleInputChange } from '../../room-helpers/roomhelper';

const ChatroomCreate = ({handleRoomCreate}) => {
  const [roomNameInput, setRoomNameInput] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    handleRoomCreate(roomNameInput)
    setRoomNameInput('')
  }

    return (
      <div className='white-card box inner-pad'>
      <p className='card-title card-label'>Create New Room</p>
       <form onSubmit={handleCreate}>
        <label>
          <span className='input-label'>Room Name</span>
        </label>
          <input className='input' type="text" value={roomNameInput} onChange={(event) => handleInputChange(event, setRoomNameInput)} required/>
        <input className='button' type="submit" value="Create" />
      </form>
      </div>
    );
}

export default ChatroomCreate;