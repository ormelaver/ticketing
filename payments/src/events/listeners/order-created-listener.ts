import { Listener, OrderCreatedEvent, Subjects } from '@omticketorg/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            version: data.version,
            price: data.ticket.price,
            status: data.status,
        });

        await order.save();

        message.ack();
    }
}
