import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './configs/db.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import EventRoutes from './routes/event.routes.js';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth',authRoutes)
app.use('/api/events',EventRoutes)



app.get('/', (req, res) => {
    res.status(200).json({ message: 'App is working' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
