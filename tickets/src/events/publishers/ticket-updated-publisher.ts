import { Publisher, Subjects, TicketUpdatedEvent } from '@omticketorg/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
