import { MongoClient } from 'mongodb';

let _client;
let _db;

export async function connectToDb() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    if (!uri) throw new Error('Missing MONGODB_URI');
    if (!dbName) throw new Error('Missing DB_NAME');

    _client = new MongoClient(uri);
    await _client.connect();
    _db = _client.db(dbName);
    console.log('Connected to MongoDB');
}

export function getDb() {
    if (!_db) throw new Error('DB not initialized. Call connectToDb() first.');
    return _db;
}
