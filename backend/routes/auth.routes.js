import express from 'express';
import { forgotPassowrdRequest, getForgotPassword, getUserInfo, logout, me, signin, signup, updatePassowrd } from '../controllers/auth.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';

const authRoutes = express.Router();

authRoutes.post('/signup',signup);
authRoutes.post('/signin',signin);
authRoutes.get('/profile',protectedRoutes,me);
authRoutes.post('/forgotPassword',forgotPassowrdRequest);
authRoutes.post('/forgotPassword/:id/:token',updatePassowrd);
authRoutes.get('/forgotPassword/:id/:token',getForgotPassword);
authRoutes.post('/logout',logout)
authRoutes.get('/user',protectedRoutes,getUserInfo)


export default authRoutes