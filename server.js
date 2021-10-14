const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path:'/sockets', transports: ["websocket"] });
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pgp = require('pg-promise')();
const path = require('path');
const db = require('./db.js');


const port = process.env.PORT || 3001;
app.set('port', port);

users = require('./routes/users.js');
chatrooms = require('./routes/chatrooms.js');
login = require('./routes/login.js');
register = require('./routes/register.js');

// app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json({extended: true}));



app.use('/users', users);
app.use('/chatrooms', chatrooms);
app.use('/login', login);
app.use('/register', register);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use((err, req, res, next) => {
	console.error(err.message);
	if (!err.statusCode) err.statusCode = 500;
	res.status(err.statusCode).send(err.message);
});

io.on('connection', (socket) => {
	console.log('connected')
	socket.on('enter', (room, username, id) => {
		try	{
			socket.join(room);
			console.log('entered room')
			socket.emit('enter success', room, username, id);
		} catch (err) {
			socket.emit('enter failed');
		}
	});



	socket.on('create room', (room, username) => {
			console.log('created room')
			socket.emit('room create success', room, username);
	});		

	socket.on('chat message', (user, msg, room, date) => {
		message = {
			content: msg,
			date_created: date,
			username: user
		};
		console.log('Room', room)
		io.to(room).emit('chat message', message);
	});

	socket.on('exit', (room)=> {
		socket.leave(room);
		console.log('left room')
	});

	socket.on('disconnect', ()=> {
		console.log('socket disconnected')
	})
});


app.get('*', (req, res) => {
	if (process.env.NODE_ENV == 'prod'){
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
	}
});


http.listen(port, function(){
  console.log('listening on ', port);
});

process.on('uncaughtException', (err) => {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

exports = module.exports = app;