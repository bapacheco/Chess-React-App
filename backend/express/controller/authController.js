import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { GameStats } from '../models/gameStats.js';
const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8080';
const ROLES = {
    USER: "USER",
    GUEST: "GUEST",
    ADMIN: "ADMIN",
}

export const Login = async (req, res) => {
    try {
        //const { email, password } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const b64_cred = authHeader.split(' ')[1];
        const decoded_cred = Buffer.from(b64_cred, 'base64').toString('ascii');
        const [email, password] = decoded_cred.split(':');

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isPasswordValid = await bycrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let spring_down = false;

        if(user.notify_spring_later) {
            const response = await notifySpringBoot(user);
            
            if (!response.ok) {
                spring_down = true;
            }
            else {
                user.notify_spring_later = false;
            }
        }

        //string is supposed to be greater than or = to 256 bit
        //change back to 15m
        const access_token = jwt.sign(
            { id: user._id, role: user.role  },
            process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
            { expiresIn: '10m' }
        );
        
        const refresh_token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
            { expiresIn: '4h' }
        )

        res.clearCookie('anonymous_token');

        //put refresh in cookie with flags in development
        res.cookie('refresh_token', refresh_token, {
            path: '/api/auth/token',
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 4 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: 'Login successful',
            spring_notify: spring_down,
            access_token,
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'server error'});
    }
};

export const Register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: ROLES.USER,
        });

        const newStats = new GameStats({ user_id: newUser._id});
        

        let response = await notifySpringBoot(newUser);
        if (!response.ok) {
            console.log("failed to notify spring boot");
            newUser.notify_spring_later = true;
        }
        await newUser.save();
        await newStats.save();


        res.status(201).json({
            message: 'User registed successfully',
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            hashedPass: hashedPassword,
        });


    } catch (error) {
        console.error("error in register controller: ", error);
        res.status(500).json({message: 'server error.'});
    }

};

export const Anonymous_Register = async (req, res) => {
    const newUser = new User({
        role: ROLES.GUEST,
    });

    const response = await notifySpringBoot(newUser);
    if (!response.ok) {
        console.log("failed to notify spring boot");
        //newUser.notify_spring_later = true;
        return res.status(500).json({ message: "service down, try later"});
    }

    await newUser.save();

    const anonymous_token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
        { expiresIn: '4h' }
    )

    res.cookie('anonymous_token', anonymous_token, {
        path: '/api/auth/anon-token',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 4 * 60 * 60 * 1000,
    });

    res.status(201).json({
        message: 'Anonymous registed successfully',
        user: { id: newUser._id, role: newUser.role},

    })
};

export const New_Anon_Token = async (req, res) => {
    const anonymous_token = req.cookies.anonymous_token;
    if (!anonymous_token) {
        return res.status(401).json({ message: 'Access or refresh token missing'});
    }

    jwt.verify(
        anonymous_token,
        process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
        (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });

            console.log(user);
            res.clearCookie('anonymous_token');

            const new_anonymous_token = jwt.sign(
                { id: user.id, },
                process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
                { expiresIn: '5h' }
            );

            res.cookie('anonymous_token', new_anonymous_token, {
                path: '/api/auth/anon-token',
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 4 * 60 * 60 * 1000,
            });

            return res.status(201).json({ message: "renew access to anonymous"});
        });

};

export const New_Token = async (req, res) => {
    const { access_token } = req.body;
    const refresh_token = req.cookies.refresh_token;

    if (!access_token || !refresh_token) {
        return res.status(401).json({ message: 'Access or refresh token missing'});
    }

    //here it would call to database to get row for access token to get
    //expire and compare with naive_utcnow(). it seems to make time in utc
    //make older access token and refresh token expire
    //add new access token and refresh token in database, send both
    jwt.verify(
        refresh_token, 
        process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
        (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            
            console.log(user);

            const new_access_token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
                { expiresIn: '15m' }
            );

            const new_refresh_token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
                { expiresIn: '5h' }
            );

            res.cookie('refresh_token', new_refresh_token, {
                path: '/api/auth/token',
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 5 * 60 * 60 * 1000,
            });

            return res.status(201).json({ access_token: new_access_token });
        });

};



const notifySpringBoot = async (user) => {
    let response;
    try {
         response = await fetch(`${SPRING_BOOT_URL}/api/session/register-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            {
                user_id: user._id.toString(),
                user_role: user.role
            }),
        });
        console.log('Successfully notified spring boot');
        

    } catch (error) {
        console.error("Failed to notify spring boot: ", error.message);
        //handle error. retry or ...
        response = {
            ok: false,
        }
    }
    return {
        ok: response.ok
    }
};
