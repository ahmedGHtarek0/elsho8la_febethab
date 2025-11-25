import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
mongoose.connect(process.env.MongoUrl ?? '').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
const port =3000 ;
const app = express();
app.use(express.json());


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});