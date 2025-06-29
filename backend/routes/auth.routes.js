import express from 'express';
import { me, signin, signup } from '../controllers/auth.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';

const authRoutes = express.Router();

authRoutes.post('/signup',signup);
authRoutes.post('/signin',signin);
authRoutes.get('/profile',protectedRoutes,me)

export default authRoutes