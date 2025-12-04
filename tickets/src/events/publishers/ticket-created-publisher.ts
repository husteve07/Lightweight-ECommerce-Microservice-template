import { Publisher, Subjects, TicketCreatedEvent } from "@michaelservingticket/common";

export class TicketCreatedEventPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

}
