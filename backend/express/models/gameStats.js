import mongoose from "mongoose";

const gameStatsSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    gamesPlayed : { type: Number, default: 0},
    wins : { type: Number, default: 0},
    losses : { type: Number, default: 0},
    rank : {type: Number, default: 1},
});

export const GameStats = mongoose.model('GameStats', gameStatsSchema);