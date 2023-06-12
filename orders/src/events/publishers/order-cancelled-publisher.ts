import { Publisher, OrderCancelledEvent, Subjects } from '@omticketorg/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
