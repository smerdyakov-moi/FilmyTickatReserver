const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const {generateUserToken,generateAdminToken} = require('../utils/tokenregistration')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (await userModel.findOne({ email })) {
    return res.status(400).send('User already exists');
  }
  try {
    const hash_pw = await bcrypt.hash(password, 10);
    await userModel.create({ name, email, password: hash_pw });
    res.send('User successfully created');
  } catch (err) {
    console.error(err);
    res.status(500).send('User creation failed');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).send('No user with such email');

  const result = await bcrypt.compare(password, user.password);
  if (result) {
    const token = generateUserToken({ email, userid: user._id })
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000, secure: false, sameSite: 'strict' })
      .json('User logged in successfully');
  } else {
    res.status(400).send('Incorrect credentials');
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false }).json('User logged out successfully');
};

const createAdmin = async (req, res) => {
  const admins = await adminModel.find();
  if (admins.length > 0) return res.status(401).send('Only one admin privilege allowed');

  const { name, email, password } = req.body;
  try {
    const hash_pw = await bcrypt.hash(password, 10);
    await adminModel.create({ name, email, password: hash_pw });
    res.send('Admin successfully created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Admin creation failed');
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email });
  if (!admin) return res.status(400).json('Not allowed admin privileges');

  const result = await bcrypt.compare(password, admin.password);
  if (result) {
    const token = generateAdminToken({ email, adminid: admin._id })
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000, secure: false, sameSite: 'strict' })
      .json('Admin logged in successfully');
  } else {
    res.status(400).json('Incorrect credentials');
  }
};

const logoutAdmin = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false }).json('Admin logged out successfully');
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  createAdmin,
  loginAdmin,
  logoutAdmin,
};
