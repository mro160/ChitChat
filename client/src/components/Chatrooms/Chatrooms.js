import React from 'react';
import './Chatrooms.css';


const Chatrooms = ({chatrooms, roomClickHandler, deleteRoomHandler}) => {
    
	const handleRoomClick = (event, room) => {
		event.preventDefault()
		roomClickHandler(room)
	}

    return (
		(chatrooms.length > 0) ? <div className='inbox-menu'>
    		<br/> 
	       	{chatrooms.map(room =>{
	       		return (
	       			<div key={room.chatroom_id}>
		       		<div className='room-link notification is-white is-light has-text-white-ter animate__animated animate__fadeIn delay 1s'>
		       			<a onClick={(event) => handleRoomClick(event, room)} href='#/'>
		       				<h1 className='In title has-text-grey has-text-weight-light is-1'>{room.name}</h1>
		       			</a>
		       			<p className='has-text-grey-light has-text-weight-light'>Created by {room.creator}</p>
		       			{deleteRoomHandler ? <button className='delete' onClick={()=> deleteRoomHandler(room.chatroom_id)}></button> : ""}
		       		</div>
		       		</div>
	       		);
	       	})
	   		}
       </div>
    :
		<div className='columns'>
			<p className='column is-vcentered is-5 is-offset-5 has-text-white-ter'>No rooms found</p>
		</div>
	);
} 

export default Chatrooms;