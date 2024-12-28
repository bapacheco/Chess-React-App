import express from 'express';
import cors from 'cors';
import router from './routes/route.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

//import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();
const app = express();
//const PORT = 5000;
const PORT = process.env.PORT || 2000;


app.use(cors({ credentials: true, origin: "http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());
//app.use(authMiddleware);
app.use(router);

//put this in env file

const uri = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB atlas connected.');
    } catch (error) {
        console.error('MongoDB connection error: ', error);
        
    }
};

connectDB();
app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
});