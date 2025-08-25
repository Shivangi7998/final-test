import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true },
  content: { type: String, required: true },
  imageURL:{ type: String, required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
