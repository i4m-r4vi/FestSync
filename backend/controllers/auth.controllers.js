import UserAuth from "../models/auth.models.js";
import bcrypt from "bcrypt"
import { generateWebToken } from "../utils/generateToken.js";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const signup = async (req, res) => {
    try {
        const { fullname, email, password, role, clgName } = req.body;
        if (!fullname || !email || !password || !clgName) {
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
        const newUser = new UserAuth({ fullname, email, password: hash, role, clgName });
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
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Password" })
        }
        const { password: _, ...safeUser } = user.toObject();
        await generateWebToken(user._id, res)
        res.status(200).json({ message: "Successfully signIn", user: safeUser });
    } catch (error) {
        console.log(`Error in signIn : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const me = async (req, res) => {
    try {
        const user = await UserAuth.findById(req.user._id).select("-password").populate({ path: "registeredEvents", select: ["-registeredUsers", "-updatedAt", "-createdAt", "-password"] });
        if (!user) {
            return res.status(400).json({ message: "user did not found" });
        }
        res.status(200).json({ userInfo: user })
    } catch (error) {
        console.error("Error occurred during me:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const forgotPassowrdRequest = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user
    const user = await UserAuth.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a token
    const secret = user._id + process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, email: user.email, fullname: user.fullname },
      secret,
      { expiresIn: "10m" }
    );

    // Create reset URL
    const resetUrl = `${process.env.BACKEND_URL}/api/auth/forgotPassword/${user._id}/${token}`;

    // Email content
    const msg = {
      to: user.email,
      from: process.env.EMAIL, // verified sender on SendGrid
      subject: "Password Reset Request",
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
      `,
    };

    // Send email
    await sgMail.send(msg);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("Error occurred during forgotPasswordRequest:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

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

export const getForgotPassword = async (req, res) => {
    try {
        const { id, token } = req.params;
        const user = await UserAuth.findOne({ _id: id })
        const secret = user._id + process.env.jwtsecret;
        try {
            jwt.verify(token, secret)
        } catch (error) {
            return res.status(404).json({ message: "Invalid Token" })
        }
        res.render('forgot-password.ejs')
    } catch (error) {
        console.error("Error occurred during getForgotPassword:", error);
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

export const getUserInfo = async (req, res) => {
    try {
        const user = await UserAuth.findById(req.user._id).select("-password").populate({ path: "registeredEvents", select: ["-registeredUsers", "-updatedAt", "-createdAt", "-password"] });
        if (!user) {
            return res.status(400).json({ message: "user did not found" });
        }
        res.status(200).json({ userInfo: user })
    } catch (error) {
        console.error("Error occurred during getUserInfo:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}