const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.config.common');
const _ = require('lodash');

let config = _.merge({}, commonConfig, {
	mode: 'production',
	stats: 'minimal',
	optimization: {
		minimize: true,
		minimizer: [new UglifyJsPlugin({sourceMap: true})]
	},
	externals: {
		'vue': 'Vue', // importing 'vue' to resolve to external cdn
	}
});

module.exports = config;