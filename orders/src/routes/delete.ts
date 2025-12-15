import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { requireAuth } from '@michaelservingticket/common';
import { OrderStatus } from '@michaelservingticket/common';
import { NotFoundError, NotAuthorizedError } from '@michaelservingticket/common';
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

//@ts-ignore
router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const {orderId} = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if(!order) {
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser!.id) {  
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  });


  res.status(204).send(order);
});

export { router as deleteOrderRouter };