import React from 'react';
import './ChatroomMenu.css';  
import { Redirect } from 'react-router-dom';

const ChatroomCreate = (props) => {
    if (props.state.user === "") {
      return <Redirect to='/login'/>
    } else return (
      <div className='white-card inner-pad'>
      <p className='card-title card-label'>Create New Room</p>
       <form onSubmit={props.handleRoomCreateSubmit}>
        <label>
          Room Name
          <input className='input' type="text" value={props.roomNameInput} onChange={props.handleCreateRoomNameChange} required/>
        </label>
        <input className='button' type="submit" value="Create" />
      </form>
      </div>
    );
}

export default ChatroomCreate;