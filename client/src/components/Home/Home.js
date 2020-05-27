import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import CreateRoomImage from '../../assets/createroom.png';
import InboxImage from '../../assets/inbox.png';
import ChatWindowImage from '../../assets/chatimage.png';

const GetStartedLink = (props) => {
	if (props.user !== ""){
		return (
			<Link to='/dashboard' className='is-size-1 has-text-white'>Get Started</Link> 
		);
	} else return (
		<Link to='/login' className='is-size-3 has-text-white'>Get Started</Link> 
	);
}

const Home = (props) => {
    return (
    <div>
    	<section className='main-content'>
	    	<div className='is-fluid columns is-vcentered feature'>
	    		<div className='column is-5 is-offset-1 has-text-grey has-text-weight-light is-size-3 img-container'>
	    			<div className='card'>
	    			<div className='card-image'>
	    				<figure className="image is-5by9">
					      <img src={CreateRoomImage} alt="Chat Functions Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    		<p className='column is-3 is-offset-1 has-text-white-ter has-text-weight-light is-size-1 has-text-centered'>search for existing chatrooms or create your own
	    		</p>
	    	</div>
	    	
	    	<div className='is-fluid columns is-centered is-vcentered feature'>
	    	<p className='column is-3 has-text-white-ter has-text-weight-light is-size-1 has-text-centered'>manage your chatrooms
	    		</p>
	    		<div className='column is-5 is-offset-1 has-text-grey has-text-weight-light is-size-3 img-container'>
	    			<div className='card'>
	    			<div className='card-image'>
	    				<figure className="image is-5by9">
					      <img src={InboxImage} alt="Inbox Menu Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    		
	    	</div>

	    	<div className='is-fluid columns is-vcentered feature'>
	    		<div className='column is-5 is-offset-1 has-text-grey has-text-weight-light img-container'>
	    			<div className='card'>
	    			<div className='card-image'>
	    				<figure className="image is-5by9">
					      <img src={ChatWindowImage} alt="Messaging Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    		<p className='column is-3 is-offset-1 has-text-white-ter has-text-weight-light is-size-1 has-text-centered'>chat with friends
	    		</p>
	    	</div>

	    <div className='container has-text-centered feature'>
			<GetStartedLink user={props.user}/>
    		</div>
    	</section>
    </div>
   	);
} 

export default Home;