const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'public', 'js', 'main.js'),
	output: {
		path: path.resolve(__dirname, 'src', 'public', 'js'),
		filename: 'index.bundle.min.js'
	},
	devtool: 'source-map',
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.js$/, 
				enforce: "pre", 
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
		extensions: [".jsx", ".js", ".json"]
	},
	optimization: {
		minimize: true,
		minimizer: [new UglifyJsPlugin({sourceMap: true})]
	},
};