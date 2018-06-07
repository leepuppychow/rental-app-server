var express = require('express');
var router = express.Router();

const db = require('../queries/properties');

router.get('/', db.getAllProperties);
router.get('/:id', db.getOneProperty);
router.post('/', db.createProperty);
router.put('/:id', db.updateProperty);
router.delete('/:id', db.deleteProperty); 

module.exports = router;


