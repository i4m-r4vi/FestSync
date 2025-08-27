import express from 'express'
import { protectedRoutes } from '../middleware/protectedRoutes.js';
import { generateCertificate } from '../controllers/certificate.controllers.js';

const certificateRoutes = express.Router();


// certificateRouter.post('/postCertificate',protectedRoutes,postCertificate);
certificateRoutes.post('/generateCertificate/:eventId',protectedRoutes,generateCertificate)

export default certificateRoutes