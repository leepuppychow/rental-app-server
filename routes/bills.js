var express = require('express');
var router = express.Router();

const db = require('../queries/bills');

router.get('/bills', db.getAllBills);
router.post('/bills', db.addNewBill);
router.put('/bills/:id', db.updateBill);
router.delete('/bills/:id', db.deleteBill);

module.exports = router;


