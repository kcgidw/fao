const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const io = SocketIO(http);

const app = express();
const httpServer = new http.Server(app);
const port = process.env.PORT || 3000;

require('./lobby').handleSocketIO(io);

app.use(express.static(path.resolve(__dirname, '..', 'public')));
httpServer.listen(port, function() {
	console.log(`httpServer listening on port ${port}`);
});