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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAuth',
            required: true,
            unique: true 
        },
        name: String,
        eventName:{
            type:String,
            required:true
        },
        mail:{
            type:String,
            required:true
        },
        subEvent: {
            type: String,
            required: true
        },
        eventDate: {
            type:String,
            required:true
        }
    }],
    SubEvents: [{
        type: String,
        required: true
    }]
}, { timestamps: true })

const EventModel = mongoose.model('Events', EventSchema);

export default EventModel