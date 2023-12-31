import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Boom',
        price: 200,
    });

    await ticket.save();
    return ticket;
};
it('fetches orders according to userId', async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.getCookie();
    const user2 = global.getCookie();

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
