import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuthRoutes from './routes/AuthRoutes';
import cookieParser from "cookie-parser";
import { createClient } from 'redis';
import { rateLimit } from 'express-rate-limit'
dotenv.config()
mongoose.connect(process.env.MongoUrl ?? '').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
const port =process.env.PORT ?? 0;
const app = express();
// rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
 ipv6Subnet: 56,

})

//middlewares 
app.use(limiter)
app.use(express.json());        
app.use(cookieParser())


export const client = createClient({
    username: process.env.NAME_REDIS ?? '',
    password: process.env.PASSWORD_REDIS ?? '',
    socket: {
        host: process.env.HOST ?? '',
        port: parseInt(process.env.PORT_REDIS ?? '0'),
    }
}); 

(async () => {
    client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
console.log('Connected to Redis');
})();


//routes
app.use('/auth',AuthRoutes)
app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});