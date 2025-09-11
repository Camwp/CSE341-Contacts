import 'dotenv/config';
import express from 'express';
import cors from 'cors';   // <-- add this
import { connectToDb, getDb } from './db/conn.js';
import contactsRouter from './routes/contacts.js';

const app = express();
app.use(express.json());

// ✅ Define your CORS allow list
const allowedOrigins = [
    'http://localhost:3000',
    'https://cse341-contacts-5rf5.onrender.com'
];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like curl/postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));  // <-- apply cors middleware

import swaggerUi from 'swagger-ui-express';
import openapi from './swagger/swaggerapi.json' with { type: 'json' };

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

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
