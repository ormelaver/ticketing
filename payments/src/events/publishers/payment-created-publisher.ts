import { Subjects, Publisher, PaymentCreatedEvent } from '@omticketorg/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
