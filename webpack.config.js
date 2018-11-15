const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'public', 'js', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'src', 'public', 'js'),
		filename: 'index.bundle.js', //'index.bundle.min.js'
	},
	devtool: 'source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/, 
				enforce: "pre", 
				use: [
					"source-map-loader",
					// {
					// 	loader: 'babel-loader',
					// 	options: {

					// 	}
					// }
				] 
			}
		],
	},
	resolve: {
		extensions: [".jsx", ".js", ".json"]
	},
	// optimization: {
	// 	minimize: true,
	// 	minimizer: [new UglifyJsPlugin()]
	// },
};