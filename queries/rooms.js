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

const getRoomsForProperty = (req, res, next) => {
  const userID = decodeJWT(req);
  const propertyID = req.params.property_id;
  db.any(`SELECT rooms.*, rooms.id AS room_id FROM rooms 
          JOIN properties ON rooms.property_id = properties.id
          JOIN tenants on tenants.id = rooms.tenant_id
          JOIN tenant_bills ON tenant_bills.tenant_id = tenants.id
          JOIN users ON users.id = properties.user_id
          WHERE users.id = ${userID}
          AND properties.id = ${propertyID}`)
    .then(data => {
      console.log(data);
      res.status(200).json({
        status: 'success',
        message: 'retrieved all tenants for this user',
        data: data,
      })
    })
    .catch((err) => next(err));
}

const createRoom = (req, res, next) => {
  
}

const updateRoom = (req, res, next) => { 
  const userID = decodeJWT(req);
  const { propertyID, rent, name } = req.body;
  const roomID = req.params.id;
  
  db.none(`UPDATE rooms
            SET rent='${rent}',
                name='${name}'
            FROM properties, users
            WHERE properties.id = rooms.property_id
            AND users.id = properties.user_id
            AND users.id = ${userID}
            AND properties.id = ${propertyID}
            AND rooms.id = ${roomID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Updated room successfully',
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        error,
      })
    })
} 

const deleteRoom = (req, res, next) => {

}

module.exports = {
  getRoomsForProperty,
  updateRoom,
  createRoom,
  deleteRoom,
}