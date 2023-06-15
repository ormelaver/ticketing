const express = require('express');
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@omticketorg/common';

const { currentUserRouter } = require('./routes/current-user');
const { signinRouter } = require('./routes/signin');
const { signoutRouter } = require('./routes/signout');
const { signupRouter } = require('./routes/signup');
// const { errorHandler } = require('./middlewares/error-handler');

// const { NotFoundError } = require('./errors/not-found-error');

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        // secure: process.env.NODE_ENV !== 'test',
        secure: false,
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
//127.0.0.1 ticketing.dev
