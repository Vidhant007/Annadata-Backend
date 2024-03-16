const path = require("path");
const fs = require("fs");
const fs_promise = require("fs").promises;
const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const EVENT = require("../models/event");
const event = require("../models/event");

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
}).fields([{ name: "images", maxCount: 1 }]);

const createEvent = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error uploading files" });
    }

    try {
      const images = req.files.images.map((file) => {
        return {
          data: file.filename,
          contentType: file.mimetype,
        };
      });

      const imageUrl = req.files.images.map(
        (file) => `${process.env.SERVER_URI}/uploads/${file.filename}`
      );
      const newEvent = new EVENT({
        name:req.body.name,
        location:req.body.location,
        imageUrl: imageUrl.join(", "), // Concatenate filenames into a comma-separated string
        description: req.body.description,
        contact:req.body.contact,
      });

      await newEvent.save();

      // Send a success response
      console.log("Event Created Sucessfully");
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating Event" });
    }
  });
};


const removeEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("Event ID not Defined");
    }

    //remove ticket
    const removedEvent = await EVENT.findByIdAndDelete({ _id: id });

    if (removedEvent) {
      return res.status(StatusCodes.OK).send(`Event Removed: ${removedEvent}`);
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Error Removing Event");
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Removing Event" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await EVENT.find();
    res.status(StatusCodes.OK).json(events);
    console.log(events);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Getting Events" });
    console.log(events);
  }
};

module.exports = {
  CREATEEVENT:createEvent,
  REMOVEEVENT:removeEvent,
  GETEVENTS:getEvents,
};