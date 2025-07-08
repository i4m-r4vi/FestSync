import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './configs/db.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import EventRoutes from './routes/event.routes.js';
import cloudinary from 'cloudinary'
import userRegRoutes from './routes/payment.routes.js';
import paymentRoutes from './routes/payment.routes.js';

dotenv.config();

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
})

app.use(express.json({
    limit:'5mb',
}))
app.use(bodyParser.urlencoded({ extended: true,limit:'5mb'}));
app.use(cookieParser());
app.use('/api/auth',authRoutes)
app.use('/api/events',EventRoutes)
app.use('/api/payment',paymentRoutes)



app.get('/', (req, res) => {
    res.status(200).json({ message: 'App is working' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
