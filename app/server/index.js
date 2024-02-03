const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

// disable `X-Powered-By` header that reveals information about the server
server.disable('x-powered-by');

// set security HTTP headers
server.use(helmet());

// parse json request body
server.use(express.json());

// parse urlencoded request body
server.use(express.urlencoded({ extended: true }));

// enable cors and allow from everywhere
server.use(cors());
server.options('*', cors());

// define api routes
server.use('/api', (req, res) => res.send('API is live!'));

// export server
module.exports = server;
