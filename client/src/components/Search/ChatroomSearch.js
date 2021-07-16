import React from 'react';
import './ChatroomMenu.css';

const ChatroomSearch = (props) => {
    return (
      <div className='white-card inner-pad'>
         <h1 className='card-title'>Search for Chatroom</h1>
         <form onSubmit={props.handleRoomSearchSubmit}>
          <div className='field'>
            <label>
              Room Name
            </label>
            <div className='control'>
              <input className='input' type='text' value={props.roomNameInput} onChange={props.handleRoomNameChange} required/>
            </div>
          </div>
           <label>
            Room Admin
            <input className='input' type='text' value={props.roomCreatorInput} onChange={props.handleRoomCreatorChange} required/>
          </label>
              <input className='button' type='submit' value='Search'/>
          </form>
      </div>
    );
}

export default ChatroomSearch;