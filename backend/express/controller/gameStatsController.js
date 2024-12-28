
import { GameStats } from '../models/gameStats.js';

export const My_Game_Stats = async (req, res) => {
    try {
        //console.log(req);
        //1 is to include, and 0 is to exclude
        const userStats = await GameStats.findOne({ user_id: req.user.id } , {
            gamesPlayed: 1,
            wins: 1,
            losses: 1,
            rank: 1,
            _id: 0,
        });

        if (!userStats) {
            return res.status(404).json({ message: 'User stats not found' });
        }
        
        res.status(200).json(userStats);

    } catch (error) {
        console.error("something went wrong getting own stats");
        res.status(500).json({ message: 'Server error' });
    }
};