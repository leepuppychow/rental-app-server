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

const setTenantBillsForProperty = (req, res, next) => {
  const userID = decodeJWT(req);
  const { propertyID, splitAmount } = req.body;

  db.any(`UPDATE tenant_bills 
          SET split_amount=${splitAmount} 
          FROM users, properties, tenants
          WHERE users.id = properties.user_id
          AND properties.id = tenants.property_id
          AND tenant_bills.tenant_id = tenants.id
          AND properties.id = ${propertyID}
          AND users.id = ${userID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Updated tenant-bills for this property ${propertyID}`,
      })
    })
    .catch((err) => next(err));
}

module.exports = {
  setTenantBillsForProperty: setTenantBillsForProperty,
}