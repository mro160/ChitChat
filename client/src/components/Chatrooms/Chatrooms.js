import React from 'react';
import './Chatrooms.css';


const Chatrooms = (props) => {
    return (props.rooms) ? (
    	<div className='inbox-menu'>
    		<br/> 
	       	{props.rooms.map(room =>{
	       		return (
	       			<div key={room.chatroom_id}>
		       		<div className='room-link notification is-white is-light has-text-white-ter animated fadeIn delay 1s'>
		       			<a onClick={() => props.roomClickHandler(room.name, room.creator, room.chatroom_id)} href='#/'>
		       				<h1 className='title has-text-grey has-text-weight-light is-1'>{room.name}</h1>
		       			</a>
		       			<p className='has-text-grey-light has-text-weight-light'>Created by {room.creator}</p>
		       			<button className='delete' onClick={()=> props.deleteRoomHandler(room.chatroom_id)}></button>
		       		</div>
		       		</div>
	       		);
	       	})
	   		}
       </div>
    ) : (
		<div className='columns'>
			<p className='column is-vcentered is-5 is-offset-5 has-text-white-ter'>No rooms found</p>
		</div>
	);
} 

export default Chatrooms;