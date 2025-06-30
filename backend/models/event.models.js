import mongoose, { mongo } from "mongoose";

const EventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    postureImg:{
        type:Array,
        default:[]
    },
    createdBy:{
        type:String,
        default:'admin'
    }
},{timestamps:true})

const EventModel = mongoose.model('Events',EventSchema);

export default EventModel