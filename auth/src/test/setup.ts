import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global {
    var getCookie: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
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

global.getCookie = async () => {
    const email = 'test@test.com';
    const password = '1234';

    const signupResponse = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
        })
        .expect(201);

    const cookie = signupResponse.get('Set-Cookie');

    return cookie;
};
