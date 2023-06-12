import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
    const ticket = await Ticket.build({
        title: 'ozora',
        price: 200,
        userId: '123',
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 100 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('should increment version by 1 after updating', async () => {
    const ticket = await Ticket.build({
        title: 'ozora',
        price: 200,
        userId: '123',
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});
