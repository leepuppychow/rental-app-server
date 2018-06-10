const options = {};
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/rental_app';
const db = pgp(connectionString);
const argon2 = require('argon2');

const findUser = (username) => {
  return db.one('SELECT * FROM users WHERE username = $1', username);
}

const createUser = async (data) => {
  const { username, password, email, venmo } = data;
  const hashedPW = await argon2.hash(password);
  // should add in error handling here for argon2 hash function

  return db.one(`INSERT INTO users(username, password, email, venmo) 
    VALUES($1, $2, $3, $4) RETURNING *`, [username, hashedPW, email, venmo]);
}

module.exports = {
  findUser: findUser,
  createUser: createUser,
}

