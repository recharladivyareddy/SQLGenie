
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import queryString from 'query-string';
import User from './models/User.js';
const app = express();
const PORT = 5001;

mongoose
  .connect('mongodb://127.0.0.1:27017/codingplatform', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
// app.use(
//   cors({
//     origin: [process.env.CLIENT_URL , 'http://localhost:5173/'],
//     credentials: true,
//   })
// );

app.use(cors());
app.use(cookieParser());

// OAuth and Token Config
const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  redirectUrl: process.env.REDIRECT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: process.env.TOKEN_EXPIRATION || '36000s',
};

const authParams = queryString.stringify({
  client_id: config.clientId,
  redirect_uri: config.redirectUrl,
  response_type: 'code',
  scope: 'openid profile email',
  access_type: 'offline',
  state: 'standard_oauth',
  prompt: 'consent',
});

const getTokenParams = (code) =>
  queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl,
  });

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};



// OAuth Routes
app.get('/auth/url', (_, res) => {
  res.json({ url: `${config.authUrl}?${authParams}` });
});

app.get('/auth/token', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'Authorization code must be provided' });

  try {
    const tokenParam = getTokenParams(code);
    const { data } = await axios.post(`${config.tokenUrl}?${tokenParam}`);

    if (!data.id_token) return res.status(400).json({ message: 'Auth error' });

    const { email, name, picture } = jwt.decode(data.id_token);
    const userPayload = { name, email, picture };

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      existingUser = new User(userPayload);
      await existingUser.save();
    }

    const token = jwt.sign({ userId: existingUser._id }, config.tokenSecret, { expiresIn: config.tokenExpiration });

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 10,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.json({ user: existingUser });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

app.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  const { name, email, password } = req.body;

  // Validation rules
  const minLength = 8;
  const hasUppercase = /[A-Z]/;
  const hasLowercase = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  // Check if all fields are provided
  if (!name || !email || !password ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate password
  if (password.length < minLength) {
    return res.status(400).json({ message: `Password must be at least ${minLength} characters long` });
  }
  if (!hasUppercase.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
  }
  if (!hasLowercase.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
  }
  if (!hasNumber.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one number' });
  }
  if (!hasSpecialChar.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one special character' });
  }

  try {
    // Check if the user already exists
    const existingUserMail = await User.findOne({ email });
    const existingUserName = await User.findOne({ name });
    if (existingUserMail || existingUserName) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.tokenSecret, { expiresIn: config.tokenExpiration });

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 10,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

