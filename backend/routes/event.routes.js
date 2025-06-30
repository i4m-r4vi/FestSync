import express from 'express'
import { eventCreation } from '../controllers/event.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';

const EventRoutes = express.Router();

EventRoutes.post('/uploadEvents',protectedRoutes,eventCreation);

export default EventRoutes