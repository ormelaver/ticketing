import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

declare global {
    var getCookie: (inputId?: string) => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;

process.env.STRIPE_KEY =
    'sk_test_51NHUXdCEtGfTBKzwJAiHaaoGwjOQSl0lbAa6vk9MEaGQfSpG3v68xTXa3K9SPjKzm0UcBcnLqTf40MXb0QjjmIEP00Mp7fxzNC';

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
}, 60000);

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
}, 60000);

global.getCookie = (inputId?: string) => {
    const payload = {
        id: inputId || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionString = JSON.stringify(session);

    const base64 = Buffer.from(sessionString).toString('base64');
    return [`session=${base64}`];
};
