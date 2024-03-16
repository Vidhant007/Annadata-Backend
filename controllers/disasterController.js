const path = require("path");
const fs = require("fs");
const fs_promise = require("fs").promises;
const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const DISASTER = require("../models/disaster");

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
}).fields([{ name: "images", maxCount: 2 }]);

const createDisasterTicket = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Error uploading files" });
      }
  
      try {
        // Check if two images are present
        if (!req.files.images || req.files.images.length !== 2) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Two images are required One  image and another QRcode" });
        }
  
        // Map the first image for imageUrl and the second image for QRcode
        const imageUrl = `${process.env.SERVER_URI}/uploads/${req.files.images[0].filename}`;
        const QRcode = `${process.env.SERVER_URI}/uploads/${req.files.images[1].filename}`;
  
        const newTicket = new DISASTER({
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          imageUrl, // Set the imageUrl
          QRcode, // Set the QRcode
          description: req.body.description,
          organisation:req.body.description,
          disasterType:req.body.disasterType,
        });
  
        await newTicket.save();
  
        // Send a success response
        console.log("DisasterTicket Created Successfully");
        res
          .status(StatusCodes.CREATED)
          .json({ message: "DisasterTicket created successfully", ticket: newTicket });
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Error creating Disasterticket" });
      }
    });
  };
  



const removeDisasterTicket = async (req, res) => {
  //feedback added as notification and ticket gets removed
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("DisasterTicket ID not Defined");
    }

    //remove ticket
    const removeTicket = await DISASTER.findByIdAndDelete({ _id: id });

    if (removeTicket) {
      return res.status(StatusCodes.OK).send(`DisasterTicket Closed: ${removeTicket}`);
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

const getDisasterTickets = async (req, res) => {
  try {
    const tickets = await DISASTER.find();
    res.status(StatusCodes.OK).json(tickets);
    console.log(tickets);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Getting  DisasterTickets" });
    console.log(tickets);
  }
};

module.exports = {
  CREATEDISASTERTICKET:createDisasterTicket,
  GETDISASTERTICKETS:getDisasterTickets,
  REMOVEDISASTERTICKET:removeDisasterTicket,
};