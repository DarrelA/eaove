import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './db/connectDB.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';
import './passports/google-oauth20.js';
import { ideaRoutes, passportRoutes } from './routes/index.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', passportRoutes);
app.use('/api/idea', ideaRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

connectDB();
app.listen(port, () => console.log(`Port: ${port}`));
