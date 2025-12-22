import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@michaelservingticket/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    // create and save a ticket
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'alskdfj',
    });
    ticket.set({ orderId });
    await ticket.save();
    // create a fake data event
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, ticket, data, msg };
}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure the ticket was updated
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.orderId).toBeUndefined();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalled();
});

