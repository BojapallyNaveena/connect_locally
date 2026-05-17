import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { generateEmbedding, userToEmbedText } from '../rag/embeddings.js';
import { addItem } from '../rag/vectorStore.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, skills, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      skills: skills || [],
      lat: location?.coordinates?.[1] || null,
      lng: location?.coordinates?.[0] || null
    });

    // Auto-index the new user for RAG
    try {
      const text = userToEmbedText(newUser.toJSON());
      const embedding = await generateEmbedding(text);
      addItem({
        id: newUser.id,
        type: 'user',
        name: newUser.name,
        role: newUser.role,
        skills: newUser.skills,
        rating: newUser.rating,
        reviewsCount: newUser.reviewsCount,
        address: newUser.address,
        availability: newUser.availability,
        bio: newUser.bio?.slice(0, 200),
        lat: newUser.lat,
        lng: newUser.lng,
        indexedAt: new Date().toISOString()
      }, embedding);
      console.log(`[RAG] Auto-indexed new user: ${newUser.name}`);
    } catch (indexError) {
      console.error('[RAG] Failed to auto-index user:', indexError.message);
      // Don't fail registration if indexing fails
    }

    // Create token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error detailed:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error detailed:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, address, skills, bio, profileImage, phoneNumber, aadharNumber } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (address) {
      user.address = address;
      // Try to extract lat/lng if address is "lat, lng" format
      const coords = address.split(',').map(s => parseFloat(s.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        user.lat = coords[0];
        user.lng = coords[1];
      }
    }
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (aadharNumber) {
      user.aadharNumber = aadharNumber;
      user.isAadharVerified = true;
    }
    
    // Skills handling (expecting comma-separated string or array)
    if (skills) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }

    await user.save();

    // Update RAG index as well if user was updated
    try {
      const text = userToEmbedText(user.toJSON());
      const embedding = await generateEmbedding(text);
      addItem({
        id: user.id,
        type: 'user',
        name: user.name,
        role: user.role,
        skills: user.skills,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        address: user.address,
        availability: user.availability,
        bio: user.bio?.slice(0, 200),
        lat: user.lat,
        lng: user.lng,
        indexedAt: new Date().toISOString()
      }, embedding);
    } catch (err) {
      console.warn('[RAG] Index update failed during profile update:', err.message);
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'role', 'profileImage', 'rating', 'address']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { type } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findByPk(req.user.id);
    user.otp = otp;
    await user.save();
    console.log(`[VERIFICATION] OTP for ${user.name}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp, type } = req.body;
    const user = await User.findByPk(req.user.id);
    
    // DEMO MODE: Allow 123456 as a universal OTP
    if (user.otp === otp || otp === '123456') {
      if (type === 'phone') user.isPhoneVerified = true;
      if (type === 'email') user.isEmailVerified = true;
      if (type === 'aadhar') user.isAadharVerified = true;
      user.otp = null;
      await user.save();
      res.status(200).json({ message: 'Verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
