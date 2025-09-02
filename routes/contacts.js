import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/conn.js';

const router = Router();

// GET /contacts  -> all
router.get('/', async (_req, res) => {
    try {
        const docs = await getDb().collection('contacts').find({}).toArray();
        res.status(200).json(docs);
    } catch (err) {
        console.error('GET /contacts error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /contacts/:id -> single
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid id format' });
        }
        const doc = await getDb().collection('contacts').findOne({ _id: new ObjectId(id) });
        if (!doc) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(doc);
    } catch (err) {
        console.error('GET /contacts/:id error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
