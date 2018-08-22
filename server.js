const express = require('express');
const server = express();

// server.get('/', (req, res) => res.send('Hello World!'));

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => console.log('Example app listening on port 3000!'));