import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../../assets/chat_bubble.svg';

const Buttons = ({user, hideMenu, logOut}) => {
  if (!user){
    return (
      <div className='navbar-item'>
      <div className='navbar-item'>       
        <Link to='/register' className='has-text-white has-text-weight-light pl-2' onClick={hideMenu}>
         Sign up
        </Link>
      </div>
      <div className='navbar-item'>
        <Link to='/login' className='has-text-white has-text-weight-light' onClick={hideMenu}>
          Log in
        </Link>
      </div>
      </div>
    );
  } else return (
    <div className="navbar-item">
      <Link to='/' className='has-text-white has-text-weight-light' onClick={logOut} >
        Logout
      </Link>
    </div>
  );
}


const ConditionalLink = ({user, pathname, hideMenu, linkname}) => {
  if (user){
    return (
      <Link to={{ pathname: pathname }} className='navbar-item has-text-white has-text-weight-light' onClick={hideMenu} >
        {linkname}
      </Link>
    );
  } else return '';
}


const NavBar = ({user, logOut}) => {
  const [active, setActive] = useState('')

  const toggleMenu = (e) => {
    if (active === ""){
      showMenu(e);
    } else {
      hideMenu(e);
    }
  } 

  const showMenu = () => {
    setActive('is-active')
  }

  const hideMenu = () => {
    setActive('')
  }

    return (
     <nav className='navbar shadow is-fixed-top' role='navigation' aria-label='main navigation'>
       <div className="navbar-brand">
          <a role="button"
           href="#" 
           className="navbar-burger" 
           aria-label="menu" 
           aria-expanded="false" 
           data-target="navbarBasicExample" 
           onClick={toggleMenu}
        >
          
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
              
      <div id='navbarBasicExample' className={'navbar-menu' + active}>
       
      <div className='navbar-start'>   
          <Link className='navbar-item' to='/' onClick={()=> hideMenu()}>
            <img className='logo' src={logo} alt="My logo" />
          </Link>
      </div>

        
     
             <div className='navbar-end'>
              <ConditionalLink user={user} linkname={'Dashboard'} pathname={'/dashboard'} hidemenu={hideMenu}/>
              <ConditionalLink user={user} linkname={'Inbox'} pathname={'/inbox'} hidemenu={hideMenu}/>
              <ConditionalLink user={user} linkname={'Manage Rooms'} pathname={'/manage'} hidemenu={hideMenu}/>
              <Buttons
                hidemenu={hideMenu} 
                user={user}
                logOut={logOut}
              />
          </div>

      </div>

    </nav>
    );
}

export default NavBar;