import UserAuth from "../models/auth.models.js";
import bcrypt from "bcrypt"
import { generateWebToken } from "../utils/generateToken.js";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export const signup = async (req, res) => {
    try {
        const { fullname, email, password, role, registred } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ error: "Please provide all required details." })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email Format" })
        }
        const existingEmail = await UserAuth.findOne({ email: email })
        if (existingEmail) {
            return res.status(400).json({ error: "Existing Email" })
        }
        const hash = await bcrypt.hash(password, 10)
        const newUser = new UserAuth({ fullname, email, password: hash, role, registred });
        if (!newUser) {
            return res.status(400).json({ error: "User Did not Created Error Occured" })
        }
        await newUser.save();
        res.status(200).json({ success: "Successfully Created user" })
    } catch (error) {
        console.log(`Error in signUp : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide all required details." })
        }
        const user = await UserAuth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "email not found. Please sign up." });
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(400).json({ error: "Invalid Password" })
        }
        await generateWebToken(user._id, res)
        res.status(200).json({ message: "Successfully signIn" });
    } catch (error) {
        console.log(`Error in signIn : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const me = async (req, res) => {
    try {
        res.status(200).json({ name: req.user.fullname });
    } catch (error) {
        console.error("Error occurred during me:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const forgotPassowrdRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserAuth.findOne({ email }).select('-password');
        const secret = user._id + process.env.jwtsecret;
        const token = jwt.sign({ id: user._id, email: user.email, fullname: user.fullname }, secret, {
            expiresIn: '1d'
        })
        const resetUrl = `http://127.0.0.1:5000/api/auth/forgotPassword/${user._id}/${token}`
        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.PASS}`
            }
        })
        const msgOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello ${user.fullname || 'User'},</p>
      <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
      <p>Please click the button below to reset your password. This link will expire in 10 minutes.</p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </p>
      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
    </div>
  `     };
        await transporter.sendMail(msgOptions, (err, info) => {
            if (err) {
                console.log(err);
                return;
            }
            res.status(200).json({ message: `Password reset link sent` });
            transporter.close();
        })
    } catch (error) {
        console.error("Error occurred during forgotPasswordRequest:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const updatePassowrd = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { newPassword } = req.body;
        const user = await UserAuth.findOne({ _id: id })
        const secret = user._id + process.env.jwtsecret;
        try {
            jwt.verify(token, secret)
        } catch (error) {
            return res.status(404).json({ message: "Invalid Token" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save()
        res.status(200).json({ message: "Password Successfully Changed" })
    } catch (error) {
        console.error("Error occurred during ForgotPasswordRequest:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('loginToken', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error occurred during Logout:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}