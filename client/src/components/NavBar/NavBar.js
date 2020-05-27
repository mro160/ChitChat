import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const Buttons = (props) => {
  if (props.user === ''){
    return (
      <div className='navbar-item'>
      <div className='navbar-item'>       
        <Link to='/register' className='has-text-white has-text-weight-light pl-2' onClick={() =>props.hidemenu()}>
         Sign up
        </Link>
      </div>
      <div className='navbar-item'>
        <Link to='/login' className='has-text-white has-text-weight-light' onClick={()=>props.hidemenu()}>
          Log in
        </Link>
      </div>
      </div>
    );
  } else return (
    <div className="navbar-item">
      <Link to='/' className='has-text-white has-text-weight-light' onClick={props.logOut} >
        Logout
      </Link>
    </div>
  );
}


const ConditionalLink = (props) => {
  if (props.user !== ''){
    return (
      <Link to={{ pathname: props.pathname }} className='navbar-item has-text-white has-text-weight-light' onClick={()=>props.hidemenu()} >
        {props.linkname}
      </Link>
    );
  } else return '';
}


class NavBar extends Component {
    constructor(props){
    super(props);
      this.state = {
        active: ''
      }
    }

  toggleMenu = (e) => {
    if (this.state.active === ""){
      this.showMenu(e);
    } else {
      this.hideMenu(e);
    }
  } 

  showMenu = () => {

    this.setState({
      active: 'is-active'
    })
  }

  hideMenu = () => {
    this.setState({
        active: ''
    })
  }
    render(){
    return (
     <nav className='navbar shadow is-fixed-top' role='navigation' aria-label='main navigation'>
     
        <a role="button"
           href="#" 
           className="navbar-burger" 
           aria-label="menu" 
           aria-expanded="false" 
           data-target="navbarBasicExample" 
           onClick={this.toggleMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>

      <div id='navbarBasicExample' className={'navbar-menu' + this.state.active}>

        <Link className='navbar-start navbar-item has-text-white has-text-weight-light' to='/' onClick={()=>this.hideMenu()}>
          Home 
        </Link>

        <ConditionalLink user={this.props.user} linkname={'Dashboard'} pathname={'/dashboard'} hidemenu={this.hideMenu}/>
        <ConditionalLink user={this.props.user} linkname={'Inbox'} pathname={'/chatrooms'} hidemenu={this.hideMenu}/>
        <ConditionalLink user={this.props.user} linkname={'Manage Rooms'} pathname={'/manage'} hidemenu={this.hideMenu}/>
     
             <div className='navbar-end'>
              <Buttons
                hidemenu={this.hideMenu} 
                user={this.props.user}
                logOut={this.props.logOut}
              />
          </div>

      </div>

    </nav>
    );
  }
}

export default NavBar;