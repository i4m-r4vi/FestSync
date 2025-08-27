import express from 'express';
import { protectedRoutes } from '../middleware/protectedRoutes.js';
import {confirmPayment, createPaymentIntent } from '../controllers/payment.controllers.js';

const paymentRoutes = express.Router();

paymentRoutes.post("/payment-intent/:id", protectedRoutes, createPaymentIntent);
paymentRoutes.post("/confirm-registration", protectedRoutes, confirmPayment);

export default paymentRoutes