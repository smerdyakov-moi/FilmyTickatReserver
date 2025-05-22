const jwt = require('jsonwebtoken')


const isLoggedin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Token missing');
  try {
    const user = jwt.verify(token, process.env.JWT_USER_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).send('Invalid token');
  }
};

const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Token missing');
  try {
    const admin = jwt.verify(token, process.env.JWT_ADMIN_KEY);
    req.admin = admin;
    next();
  } catch (err) {
    res.status(403).send('Unauthorized access');
  }
};

module.exports = { isLoggedin, isAdmin };
