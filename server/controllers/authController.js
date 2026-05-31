import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import fs from 'fs';

// Mock user DB file path
const mockUsersPath = './db_users_fallback.json';

const getMockUsers = () => {
  if (!fs.existsSync(mockUsersPath)) {
    fs.writeFileSync(mockUsersPath, JSON.stringify([]));
  }
  try {
    return JSON.parse(fs.readFileSync(mockUsersPath, 'utf8'));
  } catch (e) {
    return [];
  }
};

const saveMockUsers = (data) => {
  fs.writeFileSync(mockUsersPath, JSON.stringify(data, null, 2));
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters.',
      });
    }

    if (process.env.USE_MOCK_DB === 'true') {
      // Mock DB registration
      const users = getMockUsers();
      const exists = users.find((u) => u.email === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, error: 'Email already registered.' });
      }

      // We store password in plain text for mock - DO NOT do this in production
      const newUser = {
        _id: Math.random().toString(36).substring(2, 9),
        name,
        email: email.toLowerCase(),
        password, // In mock mode only - real mode uses bcrypt
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      saveMockUsers(users);

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        token,
        user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      });
    } else {
      // Real MongoDB registration
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already registered.' });
      }

      const user = await User.create({ name, email, password });
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Registration failed.',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password.',
      });
    }

    if (process.env.USE_MOCK_DB === 'true') {
      // Mock DB login
      const users = getMockUsers();
      const user = users.find((u) => u.email === email.toLowerCase());
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      });
    } else {
      // Real MongoDB login
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Login failed.',
    });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user data.',
    });
  }
};
