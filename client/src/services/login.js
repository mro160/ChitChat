const login = async (email, password) => {
    try{
        const response = await fetch('/login', {
			method : 'POST',
			headers: {'Content-Type' : 'application/json'},
			body : JSON.stringify({
				email    : email,
				password : password, 
			})
		})
		const user = response.json()
		return user;
    } catch (err){
        console.log(err)
    }
}

const register = async (userInfo) =>{
	try {
		const response = await fetch('/register', {
			method : 'POST',
			headers: {'Content-Type' : 'application/json'},
			body : JSON.stringify({
				email    : userInfo.email,
				username : userInfo.username,
				password : userInfo.password, 
			})
		})
		if (response.status === 409){
			return null
		}
		const user = await response.json()
		return user
 	} catch (err){
		 console.log(err)
	 }
}

export {login, register};