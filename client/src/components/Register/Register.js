import React, { Component } from 'react';
import './Register.css';

class Register extends Component{
	constructor(props){
		super(props);
		this.state = {
			emailField : '',
			passwordField: '',
			usernameField: '',
			error: false
		}
	}

	onPasswordChange = (event) =>{
		this.setState({
			passwordField : event.target.value	
		});
	}

	onEmailChange = (event) => {
		this.setState({
			emailField : event.target.value
		});
	}

	onUsernameChange = (event) => {
		this.setState({
			usernameField : event.target.value
		});
	}

	registrationError = () => {
		if (this.state.error){
			return (
				<p className='errormessage'>Incorrect email and password</p>
			);
		}
	}
	
	Register = (event) =>{
		event.preventDefault();
		fetch('/register', {
			method : 'POST',
			headers: {'Content-Type' : 'application/json'},
			body : JSON.stringify({
				email    : this.state.emailField,
				username : this.state.usernameField,
				password : this.state.passwordField, 
			})
		})
		.then(res => res.json())
		.then(user => {
			if (user){
				this.props.loadUser(user);
				//fetch all chatrooms where user is a member and store in state	
			} else throw Error();
			return user;
		})
		.then((user) => {
			let inbox = [];
			let usersCreatedRooms = [];

			fetch(`/users/${user.id}/subscriptions`, {
					method : 'GET',
					headers: {'Content-Type' : 'application/json'},
			})
			.then(res => res.json())
			.then(chatrooms => {
				inbox = chatrooms;
			})
			.then(() =>{
				fetch(`/users/${user.id}/chatrooms`, {
						method : 'GET',
						headers: {'Content-Type' : 'application/json'},
				})
				.then(res => res.json())
				.then(rooms => {
					usersCreatedRooms = rooms;
					this.props.loadChatrooms(inbox, usersCreatedRooms);
				})
				.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
		})
		.then(() => {
			this.props.redirect('/dashboard');
		})
		.catch(err => {
			this.setState({
				error: true
			})
			console.log(err);
		});
	}


	render(){
		return (
			<div className='registration-form'>
			
			<div className='columns is-size-6 is-centered is-vcentered container'>
				<div className='box is-radiusless column is-two-thirds'>
					<p className='has-text-weight-medium signup-label'>Sign Up</p>
						{this.registrationError()}
	  					<form onSubmit={this.Register}>
				          <div className='field'>
				            <label>
				              <span className='has-text-weight-light'>Email Address</span>
				            </label>
				            <div className='control has-icons-left'>
				              <input className='input' name='email-address' type='email' value={this.state.emailField} onChange={this.onEmailChange} required/>
				               <span className="icon is-small is-left">
							      <i className="fas fa-envelope"></i>
							    </span>
				            </div>
				          </div>
				           <label>
				           <span className='has-text-weight-light'>Username</span>
				           </label>
				            <div className='control has-icons-left'>
				              <input className='input' name='email-address' type='text' minLength="6" maxLength="14" value={this.state.usernameField} onChange={this.onUsernameChange} required/>
				               <span className="icon is-small is-left">
							      <i className="fas fa-user"></i>
							    </span>
				            </div>
				           <label>
				             <span className='has-text-weight-light'>Password</span>
				           </label>
				            <div className='control has-icons-left'>
				            <input className='input' type='password' minLength="6" maxLength="25" value={this.state.passwordField} onChange={this.onPasswordChange} required/>
				            <span className="icon is-small is-left">
			                  <i className="fa fa-lock"></i>
			                </span>
				          </div>
				              <input className='button' type='submit' value='Submit'/>
				          </form>

	  			</div>
  			</div>
  			<br />
			</div>
		);
	}
}


export default Register;