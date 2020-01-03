import * as path from 'path';
import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';
import compress from 'compression';
import handleSockets from './socket-handler.js';
import { loadedPrompts } from './prompt-api.js';

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

const io = SocketIO(httpServer);

function startServer() {
	return new Promise(function(resolve, reject) {
		handleSockets(io); // socket.io app logic

		app.use(compress()); // gzip responses

		app.use(express.static(path.resolve(__dirname, '..', 'public')));

		loadedPrompts.then((outputs) => {
			console.log(`Prompts loaded. Counted ${outputs.length} prompts`);
			httpServer.listen(port, function() {
				console.log(`httpServer listening on port ${port}`);
				resolve();
			});
		});
	});
}

export default startServer();