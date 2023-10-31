import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const services = {
  auth: process.env.AUTH_SERVICE,
  threads: process.env.THREADS_SERVICE,
  comments: process.env.COMMENTS_SERVICE,
  query: process.env.QUERY_SERVICE
};

// Middleware for route-specific authentication
function authenticate(req, res, next) {
    // req.authorized = true;
    // next();
  if (req.headers.authorization === 'auth_token') {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

app.get('/status', (req, res) => {
  res.send(":: API Gateway is up and running.")
});

// Create proxy middleware for the Thread Service
const threadServiceProxy = createProxyMiddleware('/thread', {
  target: services.threads,
  changeOrigin: true,
  pathRewrite: {'^/thread': ''}
});

// Create proxy middleware for the Comment Service
const commentServiceProxy = createProxyMiddleware('/comment', {
  target: services.comments,
  changeOrigin: true,
  pathRewrite: {'^/comment': ''}
});

// Create proxy middleware for the Query Service
const queryServiceProxy = createProxyMiddleware('/query', {
  target: services.query,
  changeOrigin: true,
  pathRewrite: {'^/query': ''}
});

// Apply the proxy middleware to relevant routes
app.use('/thread', threadServiceProxy);
app.use('/comment', commentServiceProxy);
app.use('/query', queryServiceProxy);

const port = 3000;
app.listen(port, () => {
    console.log(`[ SERVICE :: API GATEWAY ] API Gateway is listening on http://localhost:${port}`);
});