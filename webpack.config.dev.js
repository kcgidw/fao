const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const prodConfig = require('./webpack.config.prod');

module.exports = Object.assign({}, prodConfig, {
	mode: 'development',
	optimization: {},
});