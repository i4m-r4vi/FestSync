import express from 'express';
import { protectedRoutes } from '../middleware/protectedRoutes.js';
import { createPaymentIntent } from '../controllers/payment.controllers.js';

const paymentRoutes = express.Router();

paymentRoutes.post('/payment-intent/:id', protectedRoutes, createPaymentIntent);
// paymentRoutes.post('/register-after-payment', protectedRoutes, registerAfterPayment);

export default paymentRoutes