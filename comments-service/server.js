import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'comment-service',
    brokers: ['broker-1'],
});

const producer = kafka.producer();
producer.connect();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

let comments = [
    // comments...
]

app.get('/:threadId', (req, res) => {
    const {threadId} = req.params;
    res.json(comments.filter(e => e.threadId === threadId));
});

// Post a comment.
app.post('/:threadId', async (req, res) => {
    const {title, content} = req.body;
    const {threadId} = req.params;
    let comment = {
        threadId,
        id: 'c-' + crypto.randomBytes(12).toString('hex'),
        title,
        content,
        author: "waterrmalann"
    };
        
    comments.push(comment);
    const message = {
        key: 'comment_created',
        value: JSON.stringify(comment),
    };

    await producer.send({
        topic: 'comment-created-topic',
        messages: [message],
    });

    res.json({ message: `a comment "${title}" was posted.` })
})

// Delete a comment.
app.delete('/:threadId/:commentId', (req, res) => {
    const { threadId, commentId } = req.params;
    const idx = comments.findIndex(e => e.id === commentId);
    if (idx === -1) {
        res.status(404).json({ message: "comment not found" })
    } else {
        // todo: Send a message to kafka
        comments = comments.filter(e => e.id !== commentId);
        res.status(200).json(comments[idx]);
    }
});

const port = 3002;
app.listen(port, () => {
    console.log(`[ SERVICE :: COMMENTS ] Comments Service is listening on http://localhost:${port}`);
});