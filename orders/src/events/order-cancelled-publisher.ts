import { Subjects, Publisher, OrderCancelledEvent } from "@michaelservingticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}