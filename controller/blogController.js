import { Readable } from 'stream';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import Blog from '../models/blog.js';
import cloudinary from '../config/cloudinaryConfig.js';

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) throw new AppError('title and content are required');
  if (!req.file) throw new AppError('image is required (multipart/form-data field: image)');

  const upload = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 's60_blogs' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    bufferToStream(req.file.buffer).pipe(stream);
  });

  const blog = await Blog.create({
    title,
    content,
    imageURL: upload.secure_url,
    author: req.userId
  });

  res.status(201).json({ ok: true, blog });
});

export const getBlogs = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'name email');
  res.json({ ok: true, count: blogs.length, blogs });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'name email');
  if (!blog) throw new AppError('Blog not found', 404);
  res.json({ ok: true, blog });
});
