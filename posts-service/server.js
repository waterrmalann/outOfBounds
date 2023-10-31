import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import cors from 'cors';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'thread-service',
    brokers: ['localhost:29092'],
});

const producer = kafka.producer();
producer.connect();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let threads = [
    // threads...
]

// Post a thread.
app.post('/', async (req, res) => {
    const { title, content } = req.body;
    let thread = { id: 't-' + crypto.randomBytes(12).toString('hex'), title, content }
    threads.push(thread);

    const message = {
        key: 'post_created',
        value: JSON.stringify(thread), // Include post information in the message
    };

    await producer.send({
        topic: 'post-created-topic', // Replace with your Kafka topic
        messages: [message],
    });

    res.json({ message: `a post "${title}" was posted.` })
})

// Delete a thread.
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const idx = threads.findIndex(e => e.id === id);
    if (idx === -1) {
        res.status(404).json({ message: "thread not found" })
    } else {
        threads = threads.filter(e => e.id !== id);
        res.status(200).json(threads[idx]);

        const message = {
            key: 'post_deleted',
            value: JSON.stringify({ id }), // Include post information in the message
        };

        await producer.send({
            topic: 'post-deleted-topic', // Replace with your Kafka topic
            messages: [message],
        });
    }
});


// // Retrieve threads
// app.get('/', (req, res) => {
//     const { skip, limit } = req.query;
//     console.log(`${limit} threads fetched.`)
//     res.json({ message: `${limit} threads fetched` })
// })

// app.get('/:id', (req, res) => {
//     const { id } = req.params;
//     const idx = threads.findIndex(e => e.id === id);
//     console.log(id);
//     if (idx === -1) {
//         res.status(404).json({ message: "thread not found" })
//     } else {
//         res.status(200).json(threads[idx]);
//     }
// });

const port = 3001;
app.listen(port, () => {
    console.log(`[ SERVICE :: THREADS ] Threads Service is listening on http://localhost:${port}`);
});