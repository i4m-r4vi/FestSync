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
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Events',
            required: false,
            unique: true
        },
        eventName: {
            type: String,
            required: false
        },
        subEvent: {
            type: String,
            required: false
        },
        eventDate: {
            type: String,
            required: false
        }
    }],
}, { timestamps: true })

const UserAuth = mongoose.model("UserAuth", UserSchema);

export default UserAuth;