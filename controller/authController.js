import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import User from '../models/user.js';

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new AppError('name, email, password are required');

  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already registered', 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('email and password are required');

  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401);

  const token = signToken(user._id);

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({
      ok: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
});
