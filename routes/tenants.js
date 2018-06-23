var express = require('express');
var router = express.Router();

const db = require('../queries/tenants');

router.get('/tenants', db.getAllTenants);
// router.get('/:id', db.getOneTenant);
// router.post('/', db.createTenant);
// router.put('/:id', db.updateTenant);
// router.delete('/:id', db.deleteTenant); 

module.exports = router;


