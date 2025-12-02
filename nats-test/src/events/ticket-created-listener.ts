import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data:', data);

        console.log(`Id:${data.id}, Title: ${data.title}, Price: ${data.price}`);

        msg.ack();
    }
}

export { TicketCreatedListener };