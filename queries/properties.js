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
  const { name, street, city, state, zipcode } = req.body; 
  const user_id = decodeJWT(req);

  db.one(`INSERT INTO properties(name, street, city, state, zipcode, user_id)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [name, street, city, state, zipcode, user_id])
    .then(() => {
      res.status(201).json({
        status: 'success',
        message: `Created new property with name: ${name}`,
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
  const user_id = decodeJWT(req);
  
  db.result('DELETE FROM properties WHERE id = $1 AND user_id = $2', [id, user_id])
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

// const updatePuppy = (req, res, next) => {
//     db.none('UPDATE PUPS SET name=$1, breed=$2, age=$3, sex=$4 WHERE id=$5',
//         [req.body.name, req.body.breed, parseInt(req.body.age), req.body.sex, parseInt(req.params.id)])    
//         .then(() => {
//             res.status(200).json({
//                 status: 'success',
//                 message: `Updated puppy with ID of ${req.params.id}`,
//             });
//         })
//         .catch((err) => next(err));
// }
