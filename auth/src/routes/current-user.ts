import express, { Request, Response } from 'express';
import { currentUser } from '@omticketorg/common';
// import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get(
    '/api/users/currentuser',
    currentUser,
    // requireAuth,
    (req: Request, res: Response) => {
        res.send({ currentUser: req.currentUser || null });
    }
);

export { router as currentUserRouter };
