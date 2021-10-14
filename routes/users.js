const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/:name/chatrooms/:chatroom', async (req, res, next) => {
	try{
		const username = req.params.name
		const chatroom = req.params.chatroom 
		const room = await db.one(`SELECT chatroom_id, creator_id, name, username as creator 
									FROM chatrooms
									JOIN users u ON (u.id = creator_id) 
									WHERE username = $1 and name = $2`, [username, chatroom]);
		
		res.json(room)
	} catch (err) {
		console.log(err)
		if (err.message === 'No data returned from the query.'){
			res.status(404).json({})
		} else next(err)	
	}
});

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
	const name = req.body.chatroom_name;
	const creator_id = req.params.id;
	 	db.tx(t => { 
	 		return t.one('INSERT INTO chatrooms(name, creator_id) VALUES ($1, $2) RETURNING name, creator_id, chatroom_id', [name, creator_id])
	 			.then(data => {
		 		return t.one('INSERT INTO subscriptions(member_id, chatroom_id) VALUES ($1, $2) RETURNING member_id, chatroom_id', [creator_id, data.chatroom_id])
		 		.then((sub) =>{
		 			return t.one(`SELECT chatroom_id, creator_id, name, username as creator FROM chatrooms 
					  		JOIN users u ON (u.id = $1) 
					  		WHERE chatroom_id = $2`, [sub.member_id, sub.chatroom_id]);
		 		})
		 	}); 
	 	})
	 	.then(data => {
	 		res.status(201).json(data);
	 	})
	 	.catch(err => {
			 console.log(err.message)
			if (err.message === 'duplicate key value violates unique constraint "chatrooms_name_creator_id_key"'){
				return res.status(409).json('Room already exists');
			}
			next(err);
		}) 
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

router.delete('/:id', (req, res, next) => {
	const uid = req.params.id;

	db.none('DELETE FROM users WHERE id = $1', uid)
	 .then(() => {
	 	res.status(204).json();
	 })
	 .catch(err => {
	 	next(err);
	 });
});

module.exports = router;