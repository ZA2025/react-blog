import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
let db;
//const url = process.env.MONGODB_URL;
const url2 = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@reactblog.tqmaqmb.mongodb.net/?retryWrites=true&w=majority&appName=reactblog`;

async function connectToDb(callback) {
    const client = new MongoClient(url2);
    await client.connect();
    db = client.db('fullstack-react');
    callback();
}

export {
    db,
    connectToDb
}
