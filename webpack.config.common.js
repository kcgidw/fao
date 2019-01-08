const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'public', 'js', 'main.js'),
	output: {
		path: path.resolve(__dirname, 'src', 'public', 'js'),
		filename: 'index.bundle.min.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/, 
				use: [
					{
						loader: 'source-map-loader'
					},
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				] 
			}
		],
	},
	resolve: {
		extensions: [".jsx", ".js", ".json"],
	},
	plugins: [
		new CompressionPlugin(),
	],
};