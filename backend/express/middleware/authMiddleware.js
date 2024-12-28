import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null)
        return res.status(401);

    jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your_jwt_secret_your_jwt_secret_1234',
        (err, user) => {
            if (err) return res.status(401).json({ message: 'Invalid token' });

            req.user = user;
            next();
        }
    );

    /*

    const authHeader = req.headers.authorization;

    //below is optional
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    //other do this: const token = authHeader && authHeader.split(" ")[1];
    const token = authHeader.split(' ')[1];
    console.log(token);
    //todo complete rest

    */
}