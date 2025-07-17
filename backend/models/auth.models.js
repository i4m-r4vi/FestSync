import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        required: true,
        enum: ["student", "admin"],
        default: "student"
    },
    clgName: {
        type: String,
        required: true
    },
    registeredEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
    }]
}, { timestamps: true })

const UserAuth = mongoose.model("UserAuth", UserSchema);

export default UserAuth;