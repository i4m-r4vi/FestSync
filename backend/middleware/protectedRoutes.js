import jwt from 'jsonwebtoken'
import UserAuth from '../models/auth.models.js';

export const protectedRoutes = async (req, res, next) => {
    try {
        const token = req.cookies.loginToken;
        if(!token){
            return res.status(400).json({message:'Not Authorized'})
        }
        const decode = jwt.verify(token,process.env.jwtsecret);
        const user = await UserAuth.findById(decode.userId).select('-password');
        req.user = user
        next()
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ message: 'Not authorized' });
    }
}