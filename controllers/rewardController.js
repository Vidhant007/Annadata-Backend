const path = require("path");
const fs = require("fs");
const fs_promise = require("fs").promises;
const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const REWARD = require("../models/reward");

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

const createReward = async (req, res) => {
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

      const imageUrls = req.files.images.map(
        (file) => `${process.env.SERVER_URI}/uploads/${file.filename}`
      );
      const newReward= new REWARD({
        productName:req.body.productName,
        imageUrl: imageUrls.join(", "), // Concatenate filenames into a comma-separated string
        costPoints:req.body.costPoints,
        productDescription:req.body.productDescription,
      });

      await newReward.save();

      // Send a success response
      console.log("Reward Created Sucessfully");
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Reward created successfully", reward: newReward });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating Reward" });
    }
  });
};




const getRewards= async (req, res) => {
  try {
    const rewards = await REWARD.find();
    res.status(StatusCodes.OK).json(rewards);
    console.log(rewards);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Getting Rewards" });
    console.log(tickets);
  }
};

module.exports = {
  CREATEREWARD:createReward,
  GETREWARDS:getRewards,
};