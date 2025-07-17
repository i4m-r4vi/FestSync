import EventModel from "../models/event.models.js";
import Stripe from "stripe";
import dotenv from 'dotenv'
import UserAuth from "../models/auth.models.js";

dotenv.config()

const stripe = new Stripe(process.env.Stripe_Secret_key);

export const createPaymentIntent = async (req, res) => {
    try {
        const { id: regEvent } = req.params;
        const user = req.user;
        if (!user) {
            res.status(401).json({ Unauthorized: "Please login first." })
        }
        if (!regEvent) {
            return res.status(404).json({ error: "EventId Not Found." });
        }
        const getEvent = await EventModel.findById(regEvent);
        if (!getEvent) {
            return res.status(404).json({ error: "Event not found." });
        }
        const amount = getEvent.amount * 100;

        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount,
        //     currency: "inr",
        //     automatic_payment_methods: { enabled: true },
        //     metadata: {
        //         userId: user._id.toString(),
        //         eventId: id,
        //     },
        // });
        const userReg = await UserAuth.findById({_id:user._id});
        
        if(!userReg){
          return res.status(404).json({ error: "Invalid UserId" });
        }
        if(userReg.registeredEvents.toString() === regEvent){
          return res.status(404).json({ error: "You Already Registered for the event" });
        }
        await userReg.registeredEvents.push(regEvent)
        await getEvent.registeredUsers.push(user._id)
        await getEvent.save()
        await userReg.save()
        res.status(200).json({ message:"Registered for the event successfully" });
    } catch (error) {
        console.error(`Error in createPayment: ${error}`);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const registerAfterPayment = async (req, res) => {
  try {
    const { eventId, paymentIntentId } = req.body;
    const user = req.user;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed." });
    }
    const event = await EventModel.findById(eventId);
    const getUser = await UserAuth.findById(user._id);
    if (!event || !getUser) {
        return res.status(404).json({ error: "Not found." });
    }
    if (!event.registeredUsers.includes(user._id)) {
      event.registeredUsers.push(user._id);
      await event.save();
    }
    if (!getUser.registeredEvents.includes(event._id)) {
      getUser.registeredEvents.push(event._id);
      await getUser.save();
    }
    res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ error: "Server error." });
  }
};