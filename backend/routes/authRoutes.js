const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path to your User model

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google login route
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    // 1️⃣ Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // 2️⃣ Check if user already exists
    let user = await User.findOne({ email });

    // 3️⃣ If not, create a new user
    if (!user) {
      user = new User({
        email,
        name,
        googleId,
        password: null, // no password for Google login
      });
      await user.save();
    }

    // 4️⃣ Generate JWT for your app
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
});

// Single /me route with auth middleware and controller handler
router.get('/me', authMiddleware, getMe);
router.get('/validate', authMiddleware, (req, res) => {
  res.json({ valid: true, userId: req.user.id });
});

module.exports = router;
