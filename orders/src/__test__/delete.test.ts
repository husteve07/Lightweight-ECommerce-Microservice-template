import request from 'supertest';
import { app } from '../app';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../models/order';
import {natsWrapper} from '../nats-wrapper';

it('marks an order as cancelled', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    // Create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    // Cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);
    // Fetch the order to make sure its cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('returns an error if one user tries to cancel another users order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const user = global.signin();
    // Create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    // Cancel the order with a different user
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signin()) // different user
        .expect(401);
});

it('emits an order cancelled event', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const user = global.signin();
    // Create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    // Cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});