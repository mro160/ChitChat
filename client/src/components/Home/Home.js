import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import CreateRoomImage from '../../assets/createroom.png';
import InboxImage from '../../assets/inbox.png';
import ChatWindowImage from '../../assets/chatimage.png';

const GetStartedLink = (props) => {
	if (props.user !== ""){
		return (
			<Link to='/dashboard' className='column is-one-fifth button is-medium has-text-white shadow'>Get Started</Link> 
		);
	} else return (
		<Link to='/login' className='column is-one-fifth button is-medium has-text-white shadow'>Get Started</Link> 
	);
}

const Home = (props) => {
    return (
    <div>
    	<section className='main-content'>
	    	<div className='container is-fluid columns is-centered is-vcentered'>
	    		<div className='column is-5 has-text-grey has-text-weight-light is-size-3'>
	    			<div className='card'>
	    			<div className='card-image'>
	    				<figure className="image is-3by2">
					      <img src={CreateRoomImage} alt="Chat Functions Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    		<p className='column is-offset-2 has-text-white-ter has-text-weight-light is-size-3 has-text-centered'>search for existing chatrooms or create your own
	    		</p>
	    	</div>
	    	<div className='container is-fluid columns is-centered is-vcentered'>
	    		<div className='column is-5 has-text-grey has-text-weight-light is-size-3'>
	    			<div className='card'>
	    			<div className='card-image'>
	    				<figure className="image is-3by2">
					      <img src={InboxImage} alt="Inbox Menu Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    		<p className='column is-offset-2 has-text-white-ter has-text-weight-light is-size-3 has-text-centered'>manage your chatrooms
	    		</p>
	    	</div>

	    	<div className='container is-fluid columns is-vcentered'>
	    		<div className='column is-5 has-text-grey has-text-weight-light is-size-3'>
	    			<div className='card'>
	    			<div className='card-image'>
	    				<figure className="image is-3by2">
					      <img src={ChatWindowImage} alt="Messaging Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    		<p className='column is-offset-2 has-text-white-ter has-text-weight-light is-size-3 has-text-centered'>chat with friends
	    		</p>
	    	</div>

	    <div className='container columns is-centered is-vcentered'>
			<GetStartedLink user={props.user}/>
    		</div>
    	</section>
    </div>
   	);
} 

export default Home;