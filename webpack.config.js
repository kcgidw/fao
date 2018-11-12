var path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'public', 'js', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'src', 'public', 'js'),
		filename: 'index.bundle.js'
	},
	devtool: 'source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/, 
				enforce: "pre", 
				loader: "source-map-loader" 
			}
		],
	},
	resolve: {
		extensions: [".jsx", ".js", ".json"]
	},
};