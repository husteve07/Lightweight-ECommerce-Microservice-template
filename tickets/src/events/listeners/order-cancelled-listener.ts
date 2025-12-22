import { Listener, OrderCancelledEvent  } from "@michaelservingticket/common";
import { Subjects } from "@michaelservingticket/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedEventPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: any) {
        //Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        //If no ticket, throw error
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        //Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: undefined });
        await ticket.save();
        //Publish a ticket updated event
        await new TicketUpdatedEventPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            orderId: undefined,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });
        msg.ack();
    }
}   