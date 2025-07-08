import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    postureImg: {
        type: Array,
        default: []
    },
    EventDate: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        default: 'admin'
    },
    amount: {
        type: Number
    },
    registeredUsers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserAuth',
    }]
}, { timestamps: true })

const EventModel = mongoose.model('Events', EventSchema);

export default EventModel