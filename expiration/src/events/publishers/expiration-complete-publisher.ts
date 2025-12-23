import { Subjects, Publisher, ExpirationCompleteEvent } from "@michaelservingticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
