const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const userObj = {
    _id:       user._id,
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    phone:     user.phone,
    role:      user.role,
    avatar:    user.avatar,
    isVerified:user.isVerified,
  };

  res.status(statusCode).json({ success: true, token, user: userObj });
};

module.exports = { generateToken, sendTokenResponse };
