var express = require('express');
var router = express.Router();

const db = require('../queries/properties');

router.get('/properties', db.getAllProperties);
router.get('/properties/:id', db.getOneProperty);
router.post('/properties', db.createProperty);
router.put('/properties/:id', db.updateProperty);
router.delete('/properties/:id', db.deleteProperty); 

module.exports = router;


