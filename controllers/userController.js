const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DONOR = require("../models/donor");
const VOLUNTEER = require("../models/volunteer");

const registerDonor = async (req, res) => {
  try {
    console.log(req.body);
    const { username, phone, email, password } = req.body;

    if (!username || !phone || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing required fields" });
    }

    //checking if user is already exists
    const existingUser = await DONOR.findOne({
      $or: [{ phone: phone }, { email: email }],
    });

    if (existingUser) {
      const errorResponse = {};

      if (existingUser.phone === phone) {
        errorResponse.phone = "Phone number is already registered";
      }

      if (existingUser.email === email) {
        errorResponse.email = "Email is already registered";
      }

      return res.status(StatusCodes.BAD_REQUEST).json({ error: errorResponse });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tempUser = {
      username,
      phone,
      email,
      password: hashedPassword,
    };

    const user = await DONOR.create({ ...tempUser });

    res.status(StatusCodes.CREATED).send(user);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error Creating User");
  }
};

const registerVolunteer = async (req, res) => {
  try {
    const { username, phone, email, password, organisation } = req.body;

    if (!username || !phone || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing required fields" });
    }

    //checking if user is already exists
    const existingUser = await VOLUNTEER.findOne({
      $or: [{ phone: phone }, { email: email }],
    });

    if (existingUser) {
      const errorResponse = {};

      if (existingUser.phone === phone) {
        errorResponse.phone = "Phone number is already registered";
      }

      if (existingUser.email === email) {
        errorResponse.email = "Email is already registered";
      }

      return res.status(StatusCodes.BAD_REQUEST).json({ error: errorResponse });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tempUser = {
      username,
      phone,
      email,
      password: hashedPassword,
      organisation,
    };

    const user = await VOLUNTEER.create({ ...tempUser });

    res.status(StatusCodes.CREATED).send(user);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error Creating User");
  }
};

const loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("please provide email and password");
    }

    const user = await DONOR.findOne({ email: email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send("User Not Registered!");
    }

    //checking if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid Credentials");
    }

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error logging In !");
  }
};

const loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("please provide email and password");
    }

    const user = await VOLUNTEER.findOne({ email: email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send("User Not Registered!");
    }

    //checking if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid Credentials");
    }

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error logging In !");
  }
};
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).send("User ID not provided");
    }

    // Check if donor exists
    let user = await DONOR.findById(id);

    if (!user) {
      // If donor doesn't exist, check if volunteer exists
      user = await VOLUNTEER.findById(id);

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
      }

      // Delete the volunteer
      await VOLUNTEER.findByIdAndDelete(id);
      return res.status(StatusCodes.OK).send({
        message: "User deleted successfully",
        deleted: user,
      });
    }

    // Delete the donor
    await DONOR.findByIdAndDelete(id);
    return res.status(StatusCodes.OK).send({
      message: "User deleted successfully",
      deleted: user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error Deleting User Account");
  }
};

module.exports = {
  REGISTERDONOR: registerDonor,
  REGISTERVOLUNTEER: registerVolunteer,
  LOGINDONOR: loginDonor,
  LOGINVOLUNTEER: loginVolunteer,
  DELETEACCOUNT: deleteAccount,
};
