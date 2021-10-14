import React, { useState } from 'react';
import { login } from '../../services/login'
import './Login.css';
import { useHistory } from 'react-router-dom';

const Login = ({loadUser}) => {
	let history = useHistory()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(false)
	
	const Login = async (event) => {
		event.preventDefault()
		try {
			const u = await login(email, password)
			if (u){
				await loadUser(u)
				history.push('dashboard')
			}
		} catch (err) {
			setError(true)
			console.log(err)
		}
	}

	const loginError = () => {
		if (error) {
			return (
			<p className='errormessage'>Incorrect email and password</p>
		);
		}
		
	}
		return (
			<div className='container login-form animate__animated animate__fadeIn'>
			
			<div className='columns is-size-6 is-centered'>
				<div className='box column is-half'>
					<p className='signin-label'>Sign In</p>
						{loginError()}
	  					<form onSubmit={Login}>
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
						  <div className='field'>
				           <label>
				             <span className='has-text-weight-light input-label'>Password</span>
				           </label>
				            <div className='control has-icons-left'>
				            <input className='input' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
				            <span className="icon is-small is-left">
			                  <i className="fa fa-lock"></i>
			                </span>
				          </div>
						  </div>
				              <input className='button' type='submit' value='Submit'/>
				          </form>

	  			</div>
  			</div>

  			<br />
		</div>
		);
}


export default Login;