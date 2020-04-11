import React, { Component } from 'react';
import './Login.css';

class Login extends Component{
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

	loginError = () => {
		if (this.state.error){
			return (
				<p className='errormessage'>Incorrect email and password</p>
			);
		}
	}
	Login = (event) =>{
		event.preventDefault();
		
		fetch('/login', {
			method : 'POST',
			headers: {'Content-Type' : 'application/json'},
			body : JSON.stringify({
				email    : this.state.emailField,
				password : this.state.passwordField, 
			})
		})
		.then(res => res.json())
		.then(user => {
			if (user.id){
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
			console.log(err)
		});
	}


	render(){
		return (
			<div className='container login-form'>
			
			<div className='columns is-centered is-vcentered container'>
				<div className='box is-radiusless column is-two-thirds'>
					<h1 className='has-text-weight-medium'>Sign In</h1>
						{this.loginError()}
	  					<form onSubmit={this.Login}>
				          <div className='field'>
				            <label>
				              <span className='has-text-weight-medium'>Email Address</span>
				            </label>
				            <div className='control has-icons-left'>
				              <input className='input' name='email-address' type='email' value={this.state.emailField} onChange={this.onEmailChange} required/>
				               <span className="icon is-small is-left">
							      <i className="fas fa-envelope"></i>
							    </span>
				            </div>
				          </div>
				           <label>
				             <span className='has-text-weight-medium'>Password</span>
				           </label>
				            <div className='control has-icons-left'>
				            <input className='input' type='password' value={this.state.passwordField} onChange={this.onPasswordChange} required/>
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


export default Login;