import http from 'http';
import express from 'express';

const app = express();

app.use(express.static('dist'));

const server = http.createServer(app);

export default server;
