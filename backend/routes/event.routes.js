import express from 'express'
import { deleteEvent, eventRegistration, getAllEvents, updateEvent , getUpdateEvent} from '../controllers/event.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';

const EventRoutes = express.Router();


EventRoutes.post('/uploadEvents',protectedRoutes,eventRegistration);
EventRoutes.get('/getEvents',getAllEvents);
EventRoutes.delete('/deleteEvent/:id',protectedRoutes,deleteEvent);
EventRoutes.put('/updateEvent/:id',protectedRoutes,updateEvent);
EventRoutes.get('/getUpdateEvent/:id',protectedRoutes,getUpdateEvent);

export default EventRoutes