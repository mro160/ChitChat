const express = require('express')
const db = require ('../db.js') 
const router = express.Router()

router.get('/:name', async (req, res, next) => {
	try {
		const chatroom = req.params.name
		const rooms = await db.manyOrNone(`SELECT chatroom_id, name, creator_id, username as creator FROM chatrooms 
							JOIN users u on (u.id = creator_id) 
							WHERE name = $1`, chatroom)
		if (!rooms.length){
			res.status(404).json({})
		}
		res.json(rooms)
	} catch (err) {
		console.log(err)
		next(err)
	}
})

router.delete('/:id', (req, res, next) => {
	const chatid = req.params.id;

	db.none('DELETE FROM chatrooms WHERE chatroom_id = $1', [chatid])
	.then(()=> {
		res.status(204).json();
	})
	.catch(err => {
		next(err);
	});
});

router.get('/:id/messages', (req, res, next) => {
	db.task(t => {
		return t.any('SELECT content, date_created, u.username FROM messages JOIN users u ON (u.id = sender_id) WHERE (chat_id = $1) ORDER BY date_created DESC ', [req.params.id])
		.then(messages => {
			res.json(messages);
		})
		.catch(err => {
			next(err);
		});
	})
	.catch(err => {
		next(err);
	})
});

router.post('/:id/messages', (req, res, next) => {
	if (!req.body.content){
		let err = new Error('empty message');
		err.statusCode = 400;
		next(err);
	}

	db.task(t => {
		return t.none('INSERT INTO messages (sender_id, chat_id, content, date_created) VALUES ($1, $2, $3, to_timestamp($4/1000))', 
					[req.body.id, req.body.chatroom_id, req.body.content, req.body.date_created])
				.then(() => {
					return res.status(201);
				})
				.catch(err => {
					next(err);
				});
	}).catch(err => {
		next(err);
	});
});

router.delete('/:id/messages', (req, res, next) => {
	const chatid = req.params.id;

	db.none('DELETE FROM messages WHERE chat_id = $1', [chatid])
	.then(() => {
		res.sendStatus(204)
	})
	.catch(err => {
		next(err);
	});
});

router.post('/:id/subscriptions', (req, res, next) => {
	const chatid = req.params.id;
	const uid = req.body.user_id;

	
	db.task(t => {
		return t.one(`INSERT INTO subscriptions(member_id, chatroom_id) VALUES ($1, $2) 
			RETURNING member_id, chatroom_id`, [uid , chatid])
		.then(data => {
			return t.one(`SELECT chatroom_id, creator_id, name, username as creator FROM chatrooms 
			JOIN users u ON (u.id = creator_id) 
			WHERE chatroom_id = $1`, [chatid])
		})
	})
	.then(data => {
		res.status(201).json(data);
	})
	.catch(err => {
		if (err.message === 'duplicate key value violates unique constraint "subscriptions_pkey"'){
			return res.status(409).json('Already subscribed to chatroom');
		}
		next(err);
	})
});

router.get('/:id/subscriptions', (req, res, next)=>{
	const chatid = req.params.id;

	db.manyOrNone(`SELECT member_id FROM subscriptions WHERE chatroom_id = $1`, [chatid])
	.then(members => {
		res.json(members);
	})
	.catch(err => {
		next(err);
	})
});


router.delete('/:id/subscriptions', (req, res, next) => {
	const chatid = req.params.id;

	db.none('DELETE FROM subscriptions WHERE chatroom_id = $1', [chatid])
	.then(()=> {
		res.status(204).json();
	})
	.catch(err => {
		next(err);
	})
});

module.exports = router