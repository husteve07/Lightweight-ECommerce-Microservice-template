import { Publisher,  OrderCreatedEvent, Subjects} from "@michaelservingticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

