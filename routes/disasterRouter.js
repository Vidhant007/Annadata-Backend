const express = require("express");

const DISASTER = express.Router();

const {
  CREATEDISASTERTICKET,
  REMOVEDISASTERTICKET,
  GETDISASTERTICKETS,
} = require("../controllers/disasterController");

DISASTER.post('/createDisaster',CREATEDISASTERTICKET);
DISASTER.get('/getDisaster',GETDISASTERTICKETS);
DISASTER.delete('/removeDisaster/:id',REMOVEDISASTERTICKET);

module.exports = {
    DISASTERROUTER:DISASTER
}
