import express from 'express';
    import cors from 'cors';
    import mongoose from 'mongoose';
    import authRoutes from './routes/authRoutes';
    import nftRoutes from './routes/nftRoutes';
    import dotenv from 'dotenv';

    dotenv.config();

    const app = express();
    app.use(cors());
    app.use(express.json());

    mongoose.connect(process.env.MONGODB_URI!)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error('MongoDB connection error:', err));

    app.use('/api/auth', authRoutes);
    app.use('/api/nfts', nftRoutes);

    export default app;