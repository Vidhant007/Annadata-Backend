const path = require("path");
const fs = require("fs");
const fs_promise = require("fs").promises;
const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const TICKET = require("../models/ticket");

// storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + "-" + uniqueSuffix + ext;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: Storage,
}).single("mealImage");

const createTicket = async (req, res) => {
  console.log(req.body);
  console.log(req);

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error uploading files" });
    }

    try {
      const imageUrl = `${process.env.SERVER_URI}/uploads/${req.file?.filename}`;
      console.log(imageUrl);

      const newTicket = new TICKET({
        ownerid: req.body.ownerId.trim(),
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        category: req.body.mealName,
        imageUrl: imageUrl, // Concatenate filenames into a comma-separated string
        description: req.body.description,
        quantity: req.body.mealQuantity,
        address: req.body.address,
      });

      await newTicket.save();

      // Send a success response
      console.log("Ticket Created Sucessfully");
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Ticket created successfully", ticket: newTicket });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating ticket" });
    }
  });
};

const getUserTicket = async (req,res) =>{
  //also notifies donor by providing notification (through claimerid)
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("USER ID not Defined");
    }


    const ticket = await TICKET.findOne({ ownerid: id });

    if (ticket) {
      return res
        .status(StatusCodes.OK)
        .json(ticket);
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Error Finding Ticket");
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error creating Finding Ticket" });
  }
}

const claimTicket = async (req, res) => {
  //also notifies donor by providing notification (through claimerid)
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("Ticket ID not Defined");
    }

    const { claimerid, claimed } = req.body;

    const claimedTicket = await TICKET.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (claimedTicket) {
      return res
        .status(StatusCodes.OK)
        .send(`Ticket Claimed: ${claimedTicket}`);
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Error Claiming Ticket");
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error creating Claiming Ticket" });
  }
};

const closeTicket = async (req, res) => {
  //feedback added as notification and ticket gets removed
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("Ticket ID not Defined");
    }

    const { feedback, ownerid } = req.body;

    // add feedback as notification for DONOR (uses owner_id)

    //remove ticket
    const removeTicket = await TICKET.findByIdAndDelete({ _id: id });

    if (removeTicket) {
      return res.status(StatusCodes.OK).send(`Ticket Closed: ${removeTicket}`);
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Error Closing Ticket");
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error closing Ticket" });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await TICKET.find();
    res.status(StatusCodes.OK).json(tickets);
    console.log(tickets);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Getting Tickets" });
    console.log(tickets);
  }
};

module.exports = {
  CREATETICKET: createTicket,
  CLAIMTICKET: claimTicket,
  GETICKETS: getTickets,
  CLOSETICKET: closeTicket,
  GETUSERTICKET:getUserTicket,
};
