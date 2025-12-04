import { Publisher, Subjects, TicketUpdatedEvent } from "@michaelservingticket/common";

export class TicketUpdatedEventPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}
