import jwt from 'jsonwebtoken'

export const generateWebToken = async(userId, res) => {
        const token = await jwt.sign({ userId }, process.env.jwtsecret, {
            expiresIn: '15d',
        });
        res.cookie('loginToken', token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,    // Can't access via JavaScript
            sameSite: 'None',  // Allow across sites 
            secure: true       // Send only over HTTPS
        });
}