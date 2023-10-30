import express from 'express';
import {dotenv} from 'dotenv';
dotenv.config();

const app = express();

// code...

const port = 3002;
app.listen(port, () => {
    console.log(`[ SERVICE :: POSTS ] Posts Service is listening on http://localhost:${port}`);
});