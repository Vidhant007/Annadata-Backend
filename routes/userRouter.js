const express = require("express");
const USER = express.Router();

const {LOGINDONOR,LOGINVOLUNTEER,REGISTERDONOR,REGISTERVOLUNTEER, DELETEACCOUNT} = require('../controllers/userController');

USER.post('/registerDonor',REGISTERDONOR);
USER.post('/registerVolunteer',REGISTERVOLUNTEER);
USER.post('/loginDonor',LOGINDONOR);
USER.post('/loginVolunteer',LOGINVOLUNTEER);
USER.delete('/deleteUser/:id',DELETEACCOUNT);

module.exports = {
    USERROUTER : USER
}