import express from 'express';
import httpProxy from 'http-proxy';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const proxy = httpProxy.createProxyServer({});

const services = {
  auth: process.env.AUTH_SERVICE,
  threads: process.env.THREADS_SERVICE,
  comments: process.env.COMMENTS_SERVICE,
  queries: process.env.QUERY_SERVICE
};

// Middleware for route-specific authentication
function authenticate(req, res, next) {
    req.authorized = true;
    next();
//   if (req.headers.authorization === 'yourAuthToken') {
//     next();
//   } else {
//     res.status(401).send('Unauthorized');
//   }
}

// Route requests to the appropriate service with authentication middleware
app.all('/thread/*', authenticate, (req, res) => {
  proxy.web(req, res, { target: services.threads });
});

app.all('/comment/*', authenticate, (req, res) => {
  proxy.web(req, res, { target: services.comments });
});

app.all('/query/*', authenticate, (req, res) => {
  proxy.web(req, res, { target: services.query });
});

app.all('/auth/*', (req, res) => {
  proxy.web(req, res, { target: services.auth });
});

const port = 3000;
app.listen(port, () => {
    console.log(`[ SERVICE :: API GATEWAY ] API Gateway is listening on http://localhost:${port}`);
});