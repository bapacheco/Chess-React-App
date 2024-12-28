import express from 'express';
import { My_Game_Stats } from '../controller/gameStatsController.js';
const gameStatsRouter = express.Router();

gameStatsRouter.get('/my-stats', My_Game_Stats);

export default gameStatsRouter;
