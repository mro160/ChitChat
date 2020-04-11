const pgp = require('pg-promise')();

const dotenv = require('dotenv');

dotenv.config();

const conn = {
	user:     process.env.DB_USER,
  	host:     process.env.DB_HOST,
 	database: process.env.DB_NAME,
 	password: process.env.DB_PASSWORD,
  	port:     process.env.DB_PORT,
};

const db = pgp(conn);

module.exports = db;