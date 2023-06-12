import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRquest, BadRequestError } from '@omticketorg/common';

// const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email').isEmail().withMessage('invalid email'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('password must be between 4 and 20 characters'),
    ],
    validateRquest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email already in use');
        }

        const user = User.build({ email, password });
        await user.save();

        // generate jwt
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_KEY!
        );
        //store it on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(201).send(user);
    }
);

export { router as signupRouter };
