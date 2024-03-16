const express = require('express');
const INFO = express.Router();

const {CREATEINFORMATIVE,REMOVEINFORMATIVE,GETINFORMATIVE} = require('../controllers/informativesController');

INFO.post('/createInformative',CREATEINFORMATIVE);
INFO.delete('/removeInformative/:id',REMOVEINFORMATIVE);
INFO.get('/getInformatives',GETINFORMATIVE);

module.exports = {
    INFOROUTER:INFO,
}