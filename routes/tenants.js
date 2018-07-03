var express = require('express');
var router = express.Router();

const db = require('../queries/tenants');

router.get('/tenants', db.getAllTenants);
// router.get('/:id', db.getOneTenant);
// router.post('/', db.createTenant);
router.put('/tenants/:id', db.updateTenant);
router.delete('/tenants/:id', db.toggleTenantActive); 

module.exports = router;


