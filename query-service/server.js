import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'query-service',
    brokers: ['broker-1'],
});

const consumer = kafka.consumer({ groupId: 'query-service-group' });
consumer.connect(); // to the broker

consumer.subscribe({ topic: 'post-created-topic' });
consumer.subscribe({ topic: 'comment-created-topic' });

let threads = [
    // threads...
]
let comments = [
    // comments
];

// Listen for Kafka messages
const run = async () => {
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            // Parse the message value as JSON (assuming it was stringified when sent)
            const messageData = JSON.parse(message.value.toString());

            if (topic === 'post-created-topic') {
                console.log('[QUERY SERVICE :: Kafka] Stored a new post:', messageData);
                threads.push({ ...messageData });
            } else if (topic === 'comment-created-topic') {
                console.log('[QUERY SERVICE :: Kafka] Stored a new comment:', messageData);
                comments.push({ ...messageData });
            }
        },
    });
};

run().catch(console.error);


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json(threads);
});

app.get('/:threadId', (req, res) => {
    const {threadId} = req.params;
    res.json({ 
        ...threads.find(thread => thread.id === threadId), 
        comments: [
            ...comments.filter(comment => comment.threadId === threadId)
        ] 
    })
});

const port = 3005;
app.listen(port, () => {
    console.log(`[ SERVICE :: QUERY ] Query Service is listening on http://localhost:${port}`);
});