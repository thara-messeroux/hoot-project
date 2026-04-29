const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');

const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const verifyJwt = require('./middlewares/verify-jwt');
const hootsRouter = require('./controllers/hoots');

require('./db/connection');

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public routes
app.use('/auth', authController);

// Protected routes
app.use(verifyJwt);
app.use('/users', userController);
app.use('/hoots', hootsRouter);

app.listen(3000, () => {
  console.log('The express app is ready!');
});