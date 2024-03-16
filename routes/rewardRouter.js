const express = require("express");
const REWARD = express.Router();

const { CREATEREWARD, GETREWARDS } = require("../controllers/rewardController");

REWARD.post('/createReward',CREATEREWARD);
REWARD.get('/getRewards',GETREWARDS);

module.exports = {
    REWARDROUTER:REWARD,
}