import { Publisher, Subjects, TicketCreatedEvent } from '@omticketorg/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
