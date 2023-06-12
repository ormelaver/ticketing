import express, { Request, Response } from 'express';
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
} from '@omticketorg/common';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { requireAuth } from '@omticketorg/common';

const router = express.Router();

router.get(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const isValidOrderId = mongoose.Types.ObjectId.isValid(
            req.params.orderId
        );
        if (!isValidOrderId) {
            throw new BadRequestError('Invalid order id');
        }

        const order = await Order.findById(req.params.orderId).populate(
            'ticket'
        );
        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        res.send(order);
    }
);

export { router as showOrderRouter };
