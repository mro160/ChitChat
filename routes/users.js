const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/:name/chatrooms/:chatroom', (req, res, next) => {

	//select chatroom where creator = name and chatroom name = chatroom , get id of chatroom

	db.task(t => {
		return t.one('SELECT id from users WHERE (users.username = $1) ', [req.params.name])
			.then(data => {
				return t.one('SELECT chatroom_id from chatrooms WHERE creator_id = $1 and name = $2', [data.id, req.params.chatroom]);
			})
			.catch(err => {
				next(err);			
			})
	})
	.then(id => {
		res.json(id);
	})
	.catch(err => {
		next(err);
	});
});

//get all users created chatrooms
router.get('/:id/chatrooms', (req, res, next)=>{
	uid = req.params.id;
	db.task(t=>{
		return t.manyOrNone('SELECT c.chatroom_id, name, creator_id, u.username AS creator FROM users u JOIN chatrooms c ON (c.creator_id = u.id) WHERE c.creator_id = $1', [uid])
	})
	.then(chatrooms => {
		res.json(chatrooms);
	})
	.catch(err => {
		next(err);
	})
});

router.post('/:id/chatrooms', (req, res, next) => {
	const name =    req.body.chatroom_name;
	const creator = req.body.creator;
	const uid =     req.body.user_id;

 	let user_chatrooms = [];
 	user_chatrooms = req.body.user_chatrooms;
 	
	let foundRoom = user_chatrooms.map(chatroom => {
        return (chatroom.name === name && chatroom.creator === creator);
    });

	if (foundRoom === true){
		return res.status(409).json('Room already exists');
	}

	 	db.tx(t => { 
	 		return t.one('INSERT INTO chatrooms(name, creator_id) VALUES ($1, $2) RETURNING name, creator_id, chatroom_id', [req.body.chatroom_name, req.body.user_id])
	 			.then(data => {
		 		return t.one('INSERT INTO subscriptions(member_id, chatroom_id) VALUES ($1, $2) RETURNING member_id, chatroom_id', [req.body.user_id , data.chatroom_id])
		 		.then((sub) =>{
		 			return t.one('SELECT chatroom_id, name FROM chatrooms WHERE creator_id = $1 and chatroom_id = $2', [sub.member_id, sub.chatroom_id]);
		 		})
		 	}); 
	 	})
	 	.then(data => {
	 		res.status(201).json(data);
	 	})
	 	.catch(error => {
	 		console.log(error);
	 	}); 
});


//get all subscribed chatrooms
router.get('/:id/subscriptions', (req, res, next)=>{
	const uid = req.params.id;
	db.manyOrNone('SELECT s.chatroom_id, name, creator_id, u.username AS creator FROM subscriptions s JOIN chatrooms c ON (s.chatroom_id = c.chatroom_id AND s.member_id = $1) JOIN users u on (u.id = c.creator_id)', [uid])
	.then(chatrooms => {
		res.json(chatrooms);
	})
	.catch(err => {
		next(err);
	})
});

//create subscription
router.post('/:id/subscriptions', (req, res, next) => {

	const uid = req.body.user_id;
	const chatid = req.body.chatroom_id;
	
	db.one('INSERT INTO subscriptions(member_id, chatroom_id) VALUES ($1, $2) RETURNING member_id, chatroom_id', [uid , chatid])
	.then(data => {
		res.json(data);
	})
	.catch(err => {
		next(err);
	})
});

//delete subscription
router.delete('/:id/subscriptions/chatrooms/:chatroom', (req, res, next) => {
	const uid = req.params.id;
	const chatid = req.params.chatroom;

	db.none('DELETE FROM subscriptions WHERE member_id = $1 AND chatroom_id = $2', [uid, chatid])
	 .then(() => {
	 	res.status(204).json();
	 })
	 .catch(err => {
	 	next(err);
	 });
});

module.exports = router;