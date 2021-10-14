const express = require('express')
const router = express.Router()
const db = require('../db.js')
const bcrypt = require('bcryptjs')

router.post('/', (req, res, next) => {
	if (!req.body.email || !req.body.password){
		let err = new Error('incorrect form submission');
		err.statusCode = 400;
		next(err);
	} else {
		console.log(req.body)
		db.task(t => {
			return t.one('SELECT * FROM users WHERE email_address = $1', [req.body.email])
	      		.then(user => {
					console.log(user)
	      			//is user in db? if no, return error since user doesnt exist
	      			//if username is in db and password hash === passhash in db, return username and id
	      			const isValid = bcrypt.compareSync(req.body.password, user.hash);
					if (isValid){
						res.status(200).json({
							username: user.username,
							id: user.id
						});
					} else {
						let err = new Error('bad credentials, try again');
	      				err.statusCode = 422;
						next(err);
					}	
	      		})
	      		.catch(err => {
	      			next(err);
	      		});
		});
	}
});

module.exports = router