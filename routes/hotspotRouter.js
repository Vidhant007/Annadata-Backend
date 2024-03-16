const express = require('express');

const HOTSPOT = express.Router();

const {CREATEHOTSPOT,GETHOTSPOTS,REMOVEHOTSPOT} = require('../controllers/HotspotsController');

HOTSPOT.post('/createHotspot',CREATEHOTSPOT);
HOTSPOT.get('/getHotspots',GETHOTSPOTS);
HOTSPOT.delete('/removeHotspot/:id',REMOVEHOTSPOT);

module.exports = {
    HOTSPOTROUTER:HOTSPOT
}

