import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import indexRoute from './src/routes/indexRoute.js';
import databaseService from './src/services/database.service.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser('secret'));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
  }));

app.use('',indexRoute);

// ON START
app.listen(process.env.PORT || 8080, async (err) => {
    // connect mongoDB via service
    await databaseService.connect()
    console.log(`Banh truong lanh dia\nhttp://localhost:${process.env.PORT}`)
})


// ON EXIT
process.on('SIGINT', function () {
    console.log("\nServer bị đóng bởi tổ hợp phím Ctrl + C");
    process.exit(1);
});