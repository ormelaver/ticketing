const express = require('express');
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@omticketorg/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

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

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
//127.0.0.1 ticketing.dev
