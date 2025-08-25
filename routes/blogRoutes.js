import { Router } from 'express';
import requireAuth from '../middlewares/auth.js';
import { createBlog, getBlogs, getBlogById } from '../controller/blogController.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post('/blog', requireAuth, upload.single('image'), createBlog);
router.get('/blogs', getBlogs);
router.get('/blogs/:id', getBlogById);

export default router;
