const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
var compress = require('compression');
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

const io = SocketIO(httpServer);
require('./lobby').handleSocketIO(io);

app.use(compress()); 
app.use(express.static(path.resolve(__dirname, '..', 'public')));

const Prompts = require('./prompts');
Prompts.getPrompts.then((outputs) => {
	console.log(`Prompts loaded. Counted ${outputs.length} prompts`);
	httpServer.listen(port, function() {
		console.log(`httpServer listening on port ${port}`);
	});
});