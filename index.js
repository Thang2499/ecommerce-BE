import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import indexRoute from './src/routes/indexRoute.js';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
// app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    // credentials: true,               
  }));

await mongoose.connect(process.env.BASE_URI).then(()=>{
    console.log('connect mongoose success');
});

app.use('',indexRoute);

app.listen(process.env.PORT || 8080,()=>{
    console.log('server is running');
});