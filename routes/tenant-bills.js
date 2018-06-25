var express = require('express');
var router = express.Router();

const db = require('../queries/tenant-bills');

router.put('/tenant-bills', db.setTenantBillsForProperty);

module.exports = router;


