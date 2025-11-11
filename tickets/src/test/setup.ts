import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

let mongo: any;
beforeAll ( async () => {
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as mongoose.ConnectOptions);
 
});

beforeEach ( async () => {
    process.env.JWT_KEY = 'asldkfjalskdfj';

    if(mongoose.connection.db){
        const collections = await mongoose.connection.db.collections();
        for( let collection of collections){
            await collection.deleteMany({});
        }
    }
});

afterAll ( async () => {
    if(mongo){
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    //build a JWT payload. {id, email}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };
    //create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    //build session object {jwt: MY_JWT}
    const session = { jwt: token };
    //take JSON and encode it as base64
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');
    //return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}