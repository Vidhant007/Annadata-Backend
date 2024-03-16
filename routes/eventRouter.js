const express = require('express');

const EVENT = express.Router();

const {CREATEEVENT,GETEVENTS,REMOVEEVENT} = require('../controllers/eventsController');

EVENT.post('/createEvent',CREATEEVENT);
EVENT.get('/getEvents',GETEVENTS);
EVENT.delete('/removeEvent/:id',REMOVEEVENT);

module.exports = {
    EVENTROUTER:EVENT
}

