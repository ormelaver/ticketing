const express = require('express');
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@omticketorg/common';
import { createChargeRouter } from './routes/new';

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

app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
