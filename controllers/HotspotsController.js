const path = require("path");
const fs = require("fs");
const fs_promise = require("fs").promises;
const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const HOTSPOT = require("../models/hotspots");

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

const createHotspot = async (req, res) => {
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
      const newHotspot = new HOTSPOT({
        name:req.body.name,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        imageUrl: imageUrl.join(", "), // Concatenate filenames into a comma-separated string
        description: req.body.description,
        organisationType:req.body.organisationType,
      });

      await newHotspot.save();

      // Send a success response
      console.log("Hotspot Created Sucessfully");
      res
        .status(StatusCodes.CREATED)
        .json({ message: "hotspot created successfully", hotspot: newHotspot });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating Hotspot" });
    }
  });
};


const removeHotspot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("Hotspot ID not Defined");
    }

    //remove ticket
    const removedHotspot = await HOTSPOT.findByIdAndDelete({ _id: id });

    if (removedHotspot) {
      return res.status(StatusCodes.OK).send(`Hotspot Removed: ${removedHotspot}`);
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Error Removing Hotspot");
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Removing Hotspot" });
  }
};

const getHotspots = async (req, res) => {
  try {
    const hotspots = await HOTSPOT.find();
    res.status(StatusCodes.OK).json(hotspots);
    console.log(hotspots);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Getting hotspots" });
    console.log(hotspots);
  }
};

module.exports = {
  GETHOTSPOTS:getHotspots,
  CREATEHOTSPOT:createHotspot,
  REMOVEHOTSPOT:removeHotspot,
};