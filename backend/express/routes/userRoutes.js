import express from 'express';
import { Register, Login, New_Token, Anonymous_Register, New_Anon_Token } from '../controller/authController.js';
const userRouter = express.Router();

userRouter.post('/register', Register);
userRouter.post('/login', Login);
userRouter.put('/token', New_Token);
userRouter.put('/anon-token', New_Anon_Token);
userRouter.post('/anonymous-register', Anonymous_Register);

export default userRouter;