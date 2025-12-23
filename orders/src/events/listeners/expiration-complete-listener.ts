import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@michaelservingticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: { orderId: string; }, msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order){
            throw new Error("Order Not Foubnd");
        }

        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();        
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }

}