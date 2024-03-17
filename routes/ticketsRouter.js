const express = require("express");

const TICKET = express.Router();


const {
  CLAIMTICKET,
  CREATETICKET,
  GETICKETS,
  CLOSETICKET,
  GETUSERTICKET
} = require("../controllers/ticketsController");

TICKET.post("/createTicket",CREATETICKET);
TICKET.patch("/claimTicket/:id", CLAIMTICKET);
TICKET.get("/getTickets", GETICKETS);
TICKET.delete("/closeTicket/:id",CLOSETICKET);
TICKET.get("/getUserTicket/:id",GETUSERTICKET);

module.exports = {
  TICKETSROUTER: TICKET,
};