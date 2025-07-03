import express from 'express'
import { deleteEvent, eventRegistration, getAllEvents } from '../controllers/event.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';

const EventRoutes = express.Router();


EventRoutes.post('/uploadEvents',protectedRoutes,eventRegistration);
EventRoutes.get('/getEvents',getAllEvents);
EventRoutes.delete('/deleteEvent/:id',protectedRoutes,deleteEvent);

export default EventRoutes