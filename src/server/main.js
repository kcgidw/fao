var path = require('path');
const http = require('http');
const express = require('express');

const app = express();
const httpServer = new http.Server(app);
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '..', 'public')));
httpServer.listen(port, function() {
	console.log(`httpServer listening on port ${port}`);
});