const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'public', 'js', 'client.js'),
	output: {
		path: path.resolve(__dirname, 'src', 'public', 'js'),
		filename: 'index.bundle.min.js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
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
		extensions: [".jsx", ".js", ".json", ".vue"],
	},
	plugins: [
		new CompressionPlugin(),
		new VueLoaderPlugin(),
	],
};