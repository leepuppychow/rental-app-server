const options = {};
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/rental_app';
const db = pgp(connectionString);

// TODO: setup sessions for user auth

const getAllProperties = (req, res, next) => {
  db.any('SELECT * FROM properties')
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all properties',
      });
    })
    .catch((err) => next(err));
}

const getOneProperty = (req, res, next) => {
  const id = parseInt(req.params.id);
  db.one('SELECT * FROM properties WHERE ID = $1', id)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved one property',
      })
    })
}

const createProperty = (req, res, next) => {
  
}

const updateProperty = (req, res, next) => {
  
}

const deleteProperty = (req, res, next) => {
  
}

module.exports = {
  getAllProperties: getAllProperties,
  getOneProperty: getOneProperty,
  createProperty: createProperty,
  updateProperty: updateProperty,
  deleteProperty: deleteProperty,
}


// const createPuppy = (req, res, next) => {
//     req.body.age = parseInt(req.body.age);
//     db.none('INSERT INTO PUPS(name, breed, age, sex) VALUES(${name}, ${breed}, ${age}, ${sex})', req.body)
//         .then(() => {
//             res.status(200).json({
//                 status: 'success',
//                 message: 'Inserted one puppy',
//             });
//         })
//         .catch((err) => next(err));
// }

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

// const removePuppy = (req, res, next) => {
//     const pupID = req.params.id;
//     db.result('DELETE FROM PUPS WHERE ID = $1', pupID)
//         .then((result) => {
//             res.status(200).json({
//                 status: 'success',
//                 message: `Removed ${result.rowCount} puppy`,
//             });
//         })
//         .catch((err) => next(err));
// }

