import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import listingRoutes from './routes/listingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded images
const uploadPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Rent Cars & Houses API',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
