const prodConfig = require('./webpack.config.common');
const _ = require('lodash');

let config = _.merge({}, prodConfig, {
	mode: 'development',
	devtool: 'source-map',
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.js', // importing 'vue' to reference local development version
		}
	}
});

module.exports = config;