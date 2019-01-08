const prodConfig = require('./webpack.config.common');
const _ = require('lodash');

let config = _.merge({}, prodConfig, {
	mode: 'development',
	devtool: 'source-map',
});

module.exports = config;