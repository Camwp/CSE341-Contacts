// routes/contacts.js
import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/conn.js';

const router = Router();
const coll = () => getDb().collection('contacts');

const REQUIRED = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
const hasAll = (b) => REQUIRED.every((k) => typeof b?.[k] === 'string' && b[k].trim() !== '');

// GET /contacts (all)
router.get('/', async (_req, res) => {
    try {
        const docs = await coll().find({}).toArray();
        res.status(200).json(docs);
    } catch (err) {
        console.error('GET /contacts error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /contacts/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });

        const doc = await coll().findOne({ _id: new ObjectId(id) });
        if (!doc) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(doc);
    } catch (err) {
        console.error('GET /contacts/:id error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /contacts (create) – all fields required, return new id
router.post('/', async (req, res) => {
    try {
        if (!hasAll(req.body)) {
            return res.status(400).json({ error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' });
        }
        const { insertedId } = await coll().insertOne({
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            email: req.body.email.trim(),
            favoriteColor: req.body.favoriteColor.trim(),
            birthday: req.body.birthday.trim()
        });
        res.status(201).json({ id: insertedId.toString() });
    } catch (err) {
        console.error('POST /contacts error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /contacts/:id (replace all fields)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });
        if (!hasAll(req.body)) {
            return res.status(400).json({ error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' });
        }

        const r = await coll().updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    firstName: req.body.firstName.trim(),
                    lastName: req.body.lastName.trim(),
                    email: req.body.email.trim(),
                    favoriteColor: req.body.favoriteColor.trim(),
                    birthday: req.body.birthday.trim()
                }
            }
        );
        if (!r.matchedCount) return res.status(404).json({ error: 'Not found' });
        return res.status(204).end(); // success, no body
    } catch (err) {
        console.error('PUT /contacts/:id error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /contacts/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });

        const r = await coll().deleteOne({ _id: new ObjectId(id) });
        if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
        return res.status(204).end();
    } catch (err) {
        console.error('DELETE /contacts/:id error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
