import express from 'express'
import { deleteEvent, eventRegistration, getAllEvents, updateEvent , getUpdateEvent, getOneEvent, getRegistredUsers} from '../controllers/event.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';

const EventRoutes = express.Router();

EventRoutes.post('/uploadEvents',protectedRoutes,eventRegistration);
EventRoutes.get('/getEvents',getAllEvents);
EventRoutes.delete('/deleteEvent/:id',protectedRoutes,deleteEvent);
EventRoutes.put('/updateEvent/:id',protectedRoutes,updateEvent);
EventRoutes.get('/getUpdateEvent/:id',protectedRoutes,getUpdateEvent);
EventRoutes.get('/getOneEvents/:id',protectedRoutes,getOneEvent);
EventRoutes.get('/getRegisteredUsers',protectedRoutes,getRegistredUsers);

export default EventRoutes