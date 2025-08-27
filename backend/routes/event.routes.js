import express from 'express'
import { deleteEvent, eventRegistration, getAllEvents, updateEvent , getUpdateEvent, getOneEvent} from '../controllers/event.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';

const EventRoutes = express.Router();

EventRoutes.post('/uploadEvents',protectedRoutes,eventRegistration);
EventRoutes.get('/getEvents',getAllEvents);
EventRoutes.delete('/deleteEvent/:id',protectedRoutes,deleteEvent);
EventRoutes.put('/updateEvent/:id',protectedRoutes,updateEvent);
EventRoutes.get('/getUpdateEvent/:id',protectedRoutes,getUpdateEvent);
EventRoutes.get('/getOneEvents/:id',protectedRoutes,getOneEvent);

export default EventRoutes