import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuthRoutes from './routes/AuthRoutes';
import cookieParser from "cookie-parser";
import { createClient } from 'redis';
import { v2 as cloudinary } from 'cloudinary';
import { AllusersModel } from './DB/Allusers';
import { treeifyError } from 'zod';
dotenv.config()
mongoose.connect(process.env.MongoUrl ?? '').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
const port =process.env.PORT ?? 0;
const app = express();

//middlewares 

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