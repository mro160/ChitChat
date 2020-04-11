import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const Buttons = (props) => {
  if (props.user === ''){
    return (
      <div className='navbar-item'>
      <div className='navbar-item'>       
        <Link to='/register' className=' has-text-grey has-text-weight-light pl-2'>
         Sign up
        </Link>
      </div>
      <div className='navbar-item'>
        <Link to='/login' className='has-text-grey has-text-weight-light'>
          Log in
        </Link>
      </div>
      </div>
    );
  } else return (
    <a className='button is-light' onClick={props.logOut} href='/'>
      Logout
    </a>
  );
}


const ConditionalLink = (props) => {
  if (props.user !== ''){
    return (
      <Link to={{ pathname: props.pathname }} className='navbar-item has-text-grey has-text-weight-light' >
        {props.linkname}
      </Link>
    );
  } else return '';
}

const NavBar = (props) => {
    return (
     <nav className='navbar shadow columns' role='navigation' aria-label='main navigation'>

      <div id='navbarBasicExample' className='navbar-center column is-offset-3'>
        <div className='navbar-item'>
        <Link className='has-text-grey has-text-weight-light' to='/'>
          Home 
        </Link>

        <ConditionalLink user={props.user} linkname={'Dashboard'} pathname={'/dashboard'}/>
        <ConditionalLink user={props.user} linkname={'Inbox'} pathname={'/chatrooms'}/>
        <ConditionalLink user={props.user} linkname={'Manage Rooms'} pathname={'/manage'}/>

          <div className='navbar-item has-dropdown is-hoverable'>
            <Link className='navbar-link has-text-grey has-text-weight-light' to='/'>
              More
            </Link>

            <div className='navbar-dropdown'>
              <Link className='navbar-item'  to='/'>
                About
              </Link>
              <Link className='navbar-item'  to='/'>
                Jobs
              </Link>
              <Link className='navbar-item'  to='/'>
                Contact
              </Link>
              <hr className='navbar-divider' />
              <Link className='navbar-item'  to='/'>
                Report an issue
              </Link>
            </div>
          </div>

          <div className='navbar-end'>
              <Buttons 
                user={props.user}
                logOut={props.logOut}
              />
          </div>
        </div>

      </div>

    </nav>
    );
}

export default NavBar;