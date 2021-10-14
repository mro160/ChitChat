const pgp = require('pg-promise')();

const dotenv = require('dotenv');

dotenv.config();

let conn = '';

if ('DATABASE_URL' in process.env){
	conn =  {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false
		}
	}
} else {
	conn = {
		user:     process.env.DB_USER,
		host:     process.env.DB_HOST,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
		port:     process.env.DB_PORT,
	}
}

const db = pgp(conn);

module.exports = db;