import EventModel from "../models/event.models.js";
import UserAuth from "../models/auth.models.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.Stripe_Secret_key);

// ✅ Create Payment / Register
export const createPaymentIntent = async (req, res) => {
  try {
    const { id: regEvent } = req.params;
    const user = req.user;
    const { subEvent } = req.body;

    if (!user) {
      return res.status(401).json({ error: "Please login first." });
    }
    if (!regEvent) {
      return res.status(404).json({ error: "EventId not found." });
    }

    const getEvent = await EventModel.findById(regEvent);
    if (!getEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    const userReg = await UserAuth.findById(user._id);
    if (!userReg) {
      return res.status(404).json({ error: "Invalid UserId" });
    }

    const alreadyRegistered = userReg.registeredEvents.some(
      (el) => el.eventId.toString() === regEvent
    );
    if (alreadyRegistered) {
      return res.status(400).json({ error: "You already registered for the event." });
    }

    const amountInPaise = Math.round((getEvent.amount || 0) * 100);

    // Free event -> register directly
    if (amountInPaise <= 0) {
      userReg.registeredEvents.push({
        eventId: regEvent,
        eventName: getEvent.title,
        subEvent,
        eventDate: getEvent.EventDate
      });
      getEvent.registeredUsers.push({
        userId: user._id,
        name: user.fullname,
        eventName: getEvent.title,
        mail: user.email,
        subEvent,
        eventDate: getEvent.EventDate
      });

      await userReg.save();
      await getEvent.save();
      return res.status(200).json({ message: "Registered for the free event successfully." });
    }

    // Paid event -> create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: getEvent.title },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&eventId=${regEvent}&subEvent=${subEvent}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        userId: user._id.toString(),
        eventId: regEvent,
        subEvent,
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Error in createPaymentIntent:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Confirm Payment for Paid Events
export const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Please login first." });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed." });
    }

    const { eventId, subEvent } = session.metadata;

    const getEvent = await EventModel.findById(eventId);
    const userReg = await UserAuth.findById(user._id);

    if (!getEvent || !userReg) {
      return res.status(404).json({ error: "Event or user not found." });
    }

    const alreadyRegistered = userReg.registeredEvents.some(
      (el) => el.eventId.toString() === eventId
    );
    if (alreadyRegistered) {
      return res.status(400).json({ error: "User already registered for the event." });
    }
    userReg.registeredEvents.push({
      eventId,
      eventName: getEvent.title,
      subEvent,
      eventDate: getEvent.EventDate,
    });

    getEvent.registeredUsers.push({
      userId: user._id,
      name: user.fullname,
      eventName: getEvent.title,
      mail: user.email,
      subEvent,
      eventDate: getEvent.EventDate,
    });

    await userReg.save();
    await getEvent.save();

    return res.status(200).json({ message: "Registration confirmed successfully." });
  } catch (err) {
    console.error("Error in confirmPayment:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
