import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log("Raw request data:", req.method, req.url, req.body);
//   next();
// });

//routes
import userRoutes from './routers/user.router.js'

app.use("/api/v1/user", userRoutes)

export { app }