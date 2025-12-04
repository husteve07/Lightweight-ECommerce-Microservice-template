import express, { Request, Response } from 'express';
import { requireAuth, validateRequest} from '@michaelservingticket/common';
import { body } from 'express-validator'; 
import { Ticket } from '../models/ticket';
import { TicketCreatedEventPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
//@ts-ignore
router.post('/api/tickets', requireAuth,[
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0')
        .not()
        .isEmpty()
        .withMessage('Price is required')
], 
validateRequest,
async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();
    new TicketCreatedEventPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(201).send(ticket);
});

export { router as createTicketRouter };