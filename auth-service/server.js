import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// code...

const port = 3005;
app.listen(port, () => {
    console.log(`[ SERVICE :: AUTH ] Authentication Service is listening on http://localhost:${port}`);
});