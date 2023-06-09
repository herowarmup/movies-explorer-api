require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const limiter = require('./middleware/limiter');

const { requestLogger, errorLogger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');
const corsHandler = require('./middleware/corsHandler');

const router = require('./routes/index');

const {
  NODE_ENV, PORT, DB_PROD, DB_DEV,
} = require('./utils/config');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_PROD : DB_DEV, {
  useNewUrlParser: true,
});

app.use(corsHandler);
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
