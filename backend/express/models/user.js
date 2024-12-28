import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, trim: true, default: null},
    email: { type: String, trim: true, default: null, sparse: true},
    password: { type: String, minlength: 4, default: null},
    role: {type: String, required: true},
    notify_spring_later: { type: Boolean, default: false},
});



export const User = mongoose.model('User', userSchema);