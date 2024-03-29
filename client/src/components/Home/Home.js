import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import CreateRoomImage from '../../assets/createroom.png';
import InboxImage from '../../assets/inbox.png';
import ChatWindowImage from '../../assets/chatimage.png';

const GetStartedLink = ({user}) => {
	if (user !== null){
		return (
			<Link to='/dashboard' className='cta-get-started button is-size-6 has-text-white'>Get Started</Link> 
		);
	} else return (
			<Link to='/register' className='cta-get-started button is-size-6 has-text-white'>Get Started</Link> 
	);
}

const Home = ({user}) => {
    return (
    <div className='home animate__animated animate__fadeIn'>		
		<section className='hero section is-medium'>
		<div className='is-fluid img-section'>
	    		<div className='is-centered columns is-6 is-offset-3 has-text-grey has-text-weight-light is-size-3 img-container'>
	    			<div className='card column is-9'>
	    			<div className='card-image'>
	    				<figure className="image is-5by9">
					      <img src={CreateRoomImage} alt="Chat Functions Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    	</div>

			<div className='is-fluid columns'>
	    		<p className='column is-4 is-offset-4 has-text-white-ter has-text-weight-light is-size-1 has-text-centered'>search for existing chatrooms or create your own
	    		</p>
	    	</div>
		</section>

		<section className='hero section is-medium'>
		<div className='is-fluid img-section'>
	    		<div className='is-centered columns is-6 is-offset-3 has-text-grey has-text-weight-light is-size-3 img-container'>
	    			<div className='card column is-9'>
	    			<div className='card-image'>
	    				<figure className="image is-5by9">
					      <img src={InboxImage} alt="Inbox Menu Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    	</div>

			<div className='is-fluid columns'>
	    		<p className='column is-4 is-offset-4 has-text-white-ter has-text-weight-light is-size-1 has-text-centered'>
						manage your chatrooms
	    		</p>
	    	</div>
		</section>

		<section className='hero section is-medium'>
		<div className='is-fluid img-section'>
	    		<div className='is-centered columns is-6 is-offset-3 has-text-grey has-text-weight-light is-size-3 img-container'>
	    			<div className='card column is-9'>
	    			<div className='card-image'>
	    				<figure className="image is-5by9">
					      <img src={ChatWindowImage} alt="Messaging Example" />
					  	</figure>
					  </div>
	    			</div>
	    		</div>
	    	</div>

			<div className='is-fluid columns'>
	    		<p className='column is-4 is-offset-4 has-text-white-ter has-text-weight-light is-size-1 has-text-centered'>
					chat with friends
	    		</p>
	    	</div>
		</section>


	    <div className='cta-container has-text-centered'>
			<GetStartedLink user={user}/>
    		</div>

    </div>
   	);
} 

export default Home;