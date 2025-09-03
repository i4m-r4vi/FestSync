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
        type: String, 
        default: '' },
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
            required: false
        },
        name: String,
        eventName: { type: String, required: false },
        mail: { type: String, required: false },
        subEvent: { type: String, required: false },
        eventDate: { type: String, required: false }
    }],

    SubEvents: [{ type: String, required: true }]
}, { timestamps: true });

/**
 * ✅ Add compound unique index:
 * Ensures each (eventId, userId) pair is unique.
 * A user can register only once per event.
 */
EventSchema.index(
    { _id: 1, "registeredUsers.userId": 1 },
    { unique: true, partialFilterExpression: { "registeredUsers.userId": { $type: "objectId" } } }
);

const EventModel = mongoose.model("Events", EventSchema);

export default EventModel;
