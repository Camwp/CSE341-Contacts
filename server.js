import 'dotenv/config';
import express from 'express';
import { connectToDb, getDb } from './db/conn.js';
import contactsRouter from './routes/contacts.js';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => res.send('Hello World'));

// Contacts API
app.use('/contacts', contactsRouter);

const PORT = process.env.PORT || 8080;

connectToDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`API listening on :${PORT}`);
        });
    })
    .catch((err) => {
        console.error('DB connection failed:', err);
        process.exit(1);
    });

export function db() { return getDb(); }
