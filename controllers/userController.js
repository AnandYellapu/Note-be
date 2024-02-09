// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const crypto = require('crypto'); // Import crypto module for generating random tokens
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails

// Function to generate a random token
const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Function to send password reset email
const sendPasswordResetEmail = async (user, token) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure transporter (e.g., SMTP or any other transport method)
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

//   // Define email message
//   const message = {
//     from: process.env.SMTP_USERNAME,
//     to: user.email,
//     subject: 'Password Reset Request',
//     text: `Dear ${user.username},\n\n`
//       + 'You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n'
//       + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
//       + `http://localhost:3000/reset-password/${token}\n\n`
//       + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
//   };

//   // Send the email
//   await transporter.sendMail(message);
// };



// Define email message with basic CSS styles
const message = {
  from: process.env.SMTP_USERNAME,
  to: user.email,
  subject: 'Password Reset Request',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
      <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
      <p style="margin-bottom: 10px;">Dear ${user.username},</p>
      <p style="margin-bottom: 10px;">You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
      <p style="margin-bottom: 10px;">Please click on the following link, or paste this into your browser to complete the process:</p>
      <p style="text-align: center; margin-bottom: 20px;"><a href="https://notes-maker12.netlify.app/reset-password/${token}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p style="margin-bottom: 10px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
    </div>
  `,
};

// Send the email
await transporter.sendMail(message);
};




const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    // Check if email already exists
    const existingEmail = await User.findOne({ email });

    if (existingUsername && existingEmail) {
      return res.status(400).json({ error: 'Username and email already exist.' });
    } else if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists.' });
    } else if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, email });
    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.header('Authorization', token).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Controller function for forgot password endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with that email does not exist.' });
    }

    // Generate token and set it to user's passwordResetToken field
    const token = generateToken();
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user, token);

    res.json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Controller function for password reset endpoint
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user by passwordResetToken and ensure it hasn't expired
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('Invalid or expired token.');
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear passwordResetToken and passwordResetExpires
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log('Password reset successful.');

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: error.message });
  }
};





// Export controller functions
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
