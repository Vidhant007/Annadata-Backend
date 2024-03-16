const path = require("path");
const fs = require("fs");
const fs_promise = require("fs").promises;
const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const INFO = require("../models/informative");

const createInformative = async (req, res) => {

    try {
      const newInformative = new INFO({
        title:req.body.title,
        type:req.body.type,
        content:req.body.content,
      });

      await newInformative.save();

      // Send a success response
      console.log("Informative Created Sucessfully");
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Informative created successfully", informative: newInformative });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating Informative" });
    }
};


const removeInformative = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("Informative ID not Defined");
    }

    //remove ticket
    const removedInformative = await INFO.findByIdAndDelete({ _id: id });

    if (removedInformative) {
      return res.status(StatusCodes.OK).send(`Informative Removed: ${removedInformative}`);
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Error Removing informative");
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Removing Informative" });
  }
};

const getInformative = async (req, res) => {
  try {
    const informative = await INFO.find();
    res.status(StatusCodes.OK).json(informative);
    console.log(informative);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error Getting informatives" });
    console.log(hotspots);
  }
};

module.exports = {
  CREATEINFORMATIVE:createInformative,
  GETINFORMATIVE:getInformative,
  REMOVEINFORMATIVE:removeInformative,
};