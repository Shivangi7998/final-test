import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import connectDB from "./config/dbconfig.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => res.json({ ok: true, service: 'S60 Blog API (ESM)' }));

app.use('/', authRoutes);
app.use('/', blogRoutes);

// app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});