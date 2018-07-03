const options = {};
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/rental_app';
const db = pgp(connectionString);
const jwt = require('jsonwebtoken');

const decodeJWT = (req) => {
  const token = req.get('authorization');
  const userID = jwt.decode(token).id;
  return userID;
}

const getAllProperties = (req, res, next) => {
  const userID = decodeJWT(req);
  db.any(`SELECT DISTINCT properties.*, rent.amount FROM properties 
          LEFT JOIN rent ON properties.id = rent.property_id
          WHERE user_id = ${userID}`)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all properties',
      })
    })
    .catch((err) => next(err));
}

const getOneProperty = (req, res, next) => {
  const id = parseInt(req.params.id);
  const userID = decodeJWT(req);
  db.one('SELECT * FROM properties WHERE ID = $1 AND user_id = $2', id, userID)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved one property',
      })
    })
}

const createProperty = (req, res, next) => {
  const { street, city, state, zipcode } = req.body; 
  const user_id = decodeJWT(req);

  db.one(`INSERT INTO properties(street, city, state, zipcode, user_id)
    VALUES($1, $2, $3, $4, $5) RETURNING *`, [street, city, state, zipcode, user_id])
    .then(() => {
      res.status(201).json({
        status: 'success',
        message: `Created new property with street: ${street}`,
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    }) 
}

const updateProperty = (req, res, next) => {
  
}

const deleteProperty = (req, res, next) => {
  const id = parseInt(req.params.id);
  const userID = decodeJWT(req);
  
  db.result('DELETE FROM properties WHERE id = $1 AND user_id = $2', [id, userID])
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Removed property with ID of ${id}`
      })
    })
    .catch(err => console.log(err))
}

module.exports = {
  getAllProperties: getAllProperties,
  getOneProperty: getOneProperty,
  createProperty: createProperty,
  updateProperty: updateProperty,
  deleteProperty: deleteProperty,
}