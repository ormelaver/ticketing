import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@omticketorg/common';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'Beyonce concert',
        price: 99,
        userId: 'asdf',
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: '123',
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, message };
};

it('sets the order id of the ticket', async () => {
    const { listener, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});
