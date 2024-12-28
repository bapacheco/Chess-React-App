import express from 'express';
import userRouter from './userRoutes.js';
import gameStatsRouter from './gameStatsRoutes.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
//if this breaks, add / back to both (auth/ info/)
router.use("/api/auth/", userRouter);
router.use("/api/info/", authMiddleware, gameStatsRouter);

export default router;