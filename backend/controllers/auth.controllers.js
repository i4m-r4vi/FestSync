import UserAuth from "../models/auth.models.js";
import bcrypt from "bcrypt"
import { generateWebToken } from "../utils/generateToken.js";

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
        const user = await UserAuth.findOne({email});
        if(!user){
            return res.status(400).json({ message: "email not found. Please sign up." });
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(400).json({ error: "Invalid Password" })
        }
        await generateWebToken(user._id,res)
        res.status(200).json({message:"Successfully signIn"});
    } catch (error) {
        console.log(`Error in signIn : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const me = async(req,res)=>{
    try {
        res.status(200).json({name:req.user.fullname});
    } catch (error) {
        console.error("Error occurred during me:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
