import EventModel from "../models/event.models.js";
import cloudinary from "cloudinary"

export const eventRegistration = async (req, res) => {
    try {
        const { title, description,SubEvents, department, postureImg, EventDate, amount } = req.body;
        const users = req.user;
        
        if (users.role === "student") {
            return res.status(400).json({ error: "Student Cannot Create Event" })
        }
        if (!title || !description || !department || !EventDate || !amount || !SubEvents || !postureImg) {
            return res.status(400).json({ error: "Please enter the title, description, department,eventdate,postureImg and amount" });
        }
        var imageUrl = ''
        if (postureImg) {
            const result = await cloudinary.uploader.upload(postureImg)
            imageUrl = result.secure_url;
        }
        
        const newEvent = new EventModel({ title, description, department, EventDate, postureImg:imageUrl, createdBy: users.fullname, amount,SubEvents });
        await newEvent.save();
        res.status(200).json({ message: "Successfully Created Event" })
    } catch (error) {
        console.log(`Error in eventRegistration : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getAllEvents = async (req, res) => {
    try {
        const getEvents = await EventModel.find().sort({ createdAt: -1 });
        if (!getEvents) {
            return res.status(400).json({ error: "Failed to Get Events" })
        }
        res.status(200).json({ getEvents });
    } catch (error) {
        console.log(`Error in getAllEvents : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const getOneEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (user.role === "student") {
            return res.status(403).json({ error: "Please SignIn" });
        }
        const getEvents = await EventModel.findById({ _id: id });
        if (!getEvents) {
            return res.status(400).json({ error: "Failed to Get Events" })
        }
        res.status(200).json({ Events: getEvents });
    } catch (error) {
        console.log(`Error in getAllEvents : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (user.role === "student") {
            return res.status(403).json({ error: "Students are not allowed to delete events." });
        }
        const deleteEvents = await EventModel.findById({ _id: id });
        if (!deleteEvents) {
            return res.status(400).json({ error: "Event not found or already deleted." });
        }
        if(deleteEvents.postureImg){
            const postureImg = deleteEvents.postureImg.toString().split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(postureImg)
        }
        await EventModel.findByIdAndDelete({_id:id});
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error(`Error in deleteEvent: ${error}`);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getUpdateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (user.role === "student") {
            return res.status(403).json({ error: "Students are not allowed to get events." });
        }
        const getEvent = await EventModel.findOne({ _id: id });
        if (!getEvent) {
            return res.status(403).json({ error: "Events not Found or Deleted" });
        }
        res.status(200).json({ event: getEvent });
    } catch (error) {
        console.error(`Error in getUpdateEvent: ${error}`);
        res.status(500).json({ error: "Internal server error." });
    }
}
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const { title, description, department, postureImg, amount,EventDate,SubEvents } = req.body;
        if (user.role === "student") {
            return res.status(403).json({ error: "Students are not allowed to delete events." });
        }
        const updateEvents = await EventModel.findById({ _id: id });
        if (!updateEvents) {
            return res.status(400).json({ error: "Event not found." });
        }
        updateEvents.title = title || updateEvents.title,
        updateEvents.description = description || updateEvents.description,
        updateEvents.department = department || updateEvents.department,
        updateEvents.postureImg = postureImg || updateEvents.postureImg,
        updateEvents.amount = amount || updateEvents.amount,
        updateEvents.EventDate = EventDate || updateEvents.EventDate,
        updateEvents.SubEvents = SubEvents || updateEvents.SubEvents,

        await updateEvents.save();
        res.status(200).json({ message: "Event updated successfully." });
    } catch (error) {
        console.error(`Error in updateEvent: ${error}`);
        res.status(500).json({ error: "Internal server error." });
    }
};


