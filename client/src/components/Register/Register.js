import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { register } from '../../services/login';
import './Register.css';

const Register = ({loadUser}) => {
	let history = useHistory()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [username,setUsername] = useState('')
	const [errormessage, setErrorMessage] = useState('')
	

	// const registrationError = () => {
	// 	if (errormessage !== ''){
	// 		return (
	// 			<p className='errormessage'>Incorrect email and password</p>
	// 		);
	// 	}
	// }
	
	const Register = async (event) =>{
		event.preventDefault();
			const userInfo = {
				email : email,
				password: password,
				username: username
			}
		try { 
			const user = await register(userInfo)
			if (user){
				await loadUser(user);
				history.push('dashboard')		
				//fetch all chatrooms where user is a member and store in state	
			} else {
				setErrorMessage('username or email in use')
				setTimeout(() => {
					setErrorMessage('')
				}, 5000)
			}	
		} catch(err) {
			console.log(err)
			setErrorMessage('Invalid Form data, please try again')
			setTimeout(() => {
				setErrorMessage('')
			}, 5000)
		}
	}
	
	return (
		<div className='container registration-form animate__animated animate__fadeIn'>
		<div className='columns is-size-6 is-centered'>
			<div className='box column is-half'>
			<p className='errormessage'>{errormessage}</p>
				<p className='signup-label'>Sign Up</p>
					<form onSubmit={Register}>
						<div className='field'>
						<label>
							<span className='has-text-weight-light input-label'>Email Address</span>
						</label>
						<div className='control has-icons-left'>
							<input className='input' name='email-address' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
							<span className="icon is-small is-left">
								<i className="fas fa-envelope"></i>
							</span>
						</div>
						</div>
						<label>
						<span className='has-text-weight-light input-label'>Username</span>
						</label>
						<div className='control has-icons-left'>
							<input className='input' name='email-address' type='text' minLength="6" maxLength="14" value={username} onChange={(e) => setUsername(e.target.value)} required/>
							<span className="icon is-small is-left">
								<i className="fas fa-user"></i>
							</span>
						</div>
						<label>
							<span className='has-text-weight-light input-label'>Password</span>
						</label>
						<div className='control has-icons-left'>
						<input className='input' type='password' minLength="6" maxLength="25" value={password} onChange={(e) => setPassword(e.target.value)} required/>
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



export default Register;