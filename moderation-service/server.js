import express from 'express';
import {dotenv} from 'dotenv';
dotenv.config();

const app = express();

// code...

const port = 3004;
app.listen(port, () => {
    console.log(`[ SERVICE :: MODERATION ] Moderation Service is listening on http://localhost:${port}`);
});