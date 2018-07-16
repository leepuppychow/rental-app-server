var express = require('express');
var router = express.Router();

const db = require('../queries/rooms');

router.get('/rooms/:property_id', db.getRoomsForProperty);
router.post('/rooms', db.createRoom);
router.put('/rooms/:id', db.updateRoom);
router.delete('/rooms/:id', db.deleteRoom);

module.exports = router;


