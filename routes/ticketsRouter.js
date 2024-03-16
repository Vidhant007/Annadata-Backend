const express = require("express");

const TICKET = express.Router();


const {
  CLAIMTICKET,
  CREATETICKET,
  GETICKETS,
  CLOSETICKET,
} = require("../controllers/ticketsController");

TICKET.post("/createTicket",CREATETICKET);
TICKET.patch("/claimTicket/:id", CLAIMTICKET);
TICKET.get("/getTickets", GETICKETS);
TICKET.delete("/closeTicket/:id",CLOSETICKET);

module.exports = {
  TICKETSROUTER: TICKET,
};