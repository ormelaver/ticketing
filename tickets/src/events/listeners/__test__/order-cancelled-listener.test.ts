import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent, OrderStatus } from '@omticketorg/common';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'Modem',
        price: 99,
        userId: 'asdf',
    });

    ticket.set({ orderId });

    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, orderId, message };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, orderId, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(message.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
