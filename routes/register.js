const express = require('express')
const router = express.Router()
const db = require('../db.js')
const bcrypt = require('bcryptjs')
const saltRounds = 10;

router.post('/', (req, res, next) => {
	console.log(req.body)
	if (!req.body.email || !req.body.password|| !req.body.username){
		let err = new Error('incorrect form submission');
		err.statusCode = 400;
		next(err);
	} else {
		db.task(t => {
				return t.none('SELECT username FROM users WHERE username = $1', [req.body.username])
      			.then(user => {
      				const hash =  bcrypt.hashSync(req.body.password, saltRounds);
      				return t.one('INSERT INTO users(username, email_address, hash, joined) VALUES($1, $2, $3, $4) RETURNING *', 
      						[req.body.username, req.body.email, hash, new Date()])
		    			.then(data => {
		    				res.json(data);
		    			})
		    			.catch(err => {
		    				next(err);
		    			});
      		})				
      		.catch(err => {
				if (err.message === 'No return data was expected.'){
					res.status(409).send()
				}
      		});
  		})
  		.catch(err => {
  			next(err);
  		})
  	}
});

module.exports = router