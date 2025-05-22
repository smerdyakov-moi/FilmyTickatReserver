const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  createAdmin,
  loginAdmin,
  logoutAdmin,
} = require('../controllers/authController')

const { isLoggedin, isAdmin } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', isLoggedin, logoutUser);

router.post('/createAdmin', createAdmin);
router.post('/loginAdmin', loginAdmin);
router.get('/logoutAdmin', isAdmin, logoutAdmin);

module.exports = router;
