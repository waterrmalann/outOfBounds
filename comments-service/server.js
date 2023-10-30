import express from 'express';
import {dotenv} from 'dotenv';
dotenv.config();

const app = express();

// code...

const port = 3003;
app.listen(port, () => {
    console.log(`[ SERVICE :: COMMENTS ] Comments Service is listening on http://localhost:${port}`);
});