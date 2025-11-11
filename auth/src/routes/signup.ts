import express, { Request, Response } from 'express';

import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@michaelservingticket/common';

import { User } from '../models/user';
import ts from 'typescript';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20})
        .withMessage('pwd must be between 4 to 20 characters')
],
//@ts-ignore
 validateRequest,
 async (req : Request, res: Response) => {

    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });

    if(existingUser){
        throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    const userJWT = jwt.sign(
    {
        id: user.id,
        email: user.email
    }, 
    process.env.JWT_KEY!
    );
    req.session = {
        //@ts-ignore
        jwt: userJWT
    };
    res.status(201).send(user);

});

export { router as signUpRouter };