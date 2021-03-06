const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static(__dirname + '/dist'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.set(port);
const server = http.createServer(app);
server.listen(port, () => console.log('Running…'));
