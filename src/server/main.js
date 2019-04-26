const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const compress = require('compression');

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

const io = SocketIO(httpServer);

function startServer() {
	return new Promise(function(resolve, reject) {
		require('./socket-handler')(io); // socket.io app logic

		app.use(compress()); // gzip responses

		app.use(express.static(path.resolve(__dirname, '..', 'public')));

		const Prompts = require('./prompts');
		Prompts.getPrompts.then((outputs) => {
			console.log(`Prompts loaded. Counted ${outputs.length} prompts`);
			httpServer.listen(port, function() {
				console.log(`httpServer listening on port ${port}`);
				resolve();
			});
		});
	});
}

module.exports = startServer();