require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ROUTERS
const {USERROUTER} = require('./routes/userRouter');
const {TICKETSROUTER} = require('./routes/ticketsRouter');



const { CONNECTDATABSE } = require('./db/connect');
const { DISASTERROUTER } = require('./routes/disasterRouter');
const { EVENTROUTER } = require('./routes/eventRouter');
const { HOTSPOTROUTER } = require('./routes/hotspotRouter');
const { INFOROUTER } = require('./routes/informativeRouter');
const { REWARDROUTER } = require('./routes/rewardRouter');




//ROUTES
app.use('/api/user',USERROUTER);
app.use('/api/ticket',TICKETSROUTER);
app.use('/api/disaster',DISASTERROUTER);
app.use('/api/event',EVENTROUTER);
app.use('/api/hotspot',HOTSPOTROUTER);
app.use('/api/info',INFOROUTER);
app.use('/api/reward/',REWARDROUTER);


const PORT = process.env.PORT ;

const start = async()=>{
  try{
    
    CONNECTDATABSE();
    app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`);
    })

  }catch(error){
    console.log(error);
  }
}

start();