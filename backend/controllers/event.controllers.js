import EventModel from "../models/event.models.js";

export const eventCreation = async (req, res) => {
    try {
        const { title, description, department, postureImg, createdBy } = req.body;
        const users = req.user;
        if (users.role == 'student') {
            return res.status(400).json({ error: "Student Cannot Create Event" })
        }
        if (!title || !description || !department) {
            return res.status(400).json({ error: "Please enter the title, description, and department." });
        }
        const newEvent = new EventModel({ title, description, department, postureImg, createdBy:users.fullname });
        await newEvent.save();
        res.status(200).json({ message: "Successfully Created Event" })
    } catch (error) {
        console.log(`Error in eventRegistration : ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }

}