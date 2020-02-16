const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
	const prod = env.production;
	const config = {
		entry: [path.resolve(__dirname, 'src', 'public', 'js', 'index.js')],
		output: {
			path: path.resolve(__dirname, 'dist', 'public', 'js'),
			filename: 'index.bundle.min.js',
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'source-map-loader',
						},
						{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
							},
						},
					],
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						{
							loader: CssExtractPlugin.loader,
						},
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				},
			],
		},

		resolve: {
			alias: prod ? undefined : {
				// 'vue' to reference local development version (allows for vue devtools)
				vue$: 'vue/dist/vue.js',
			},
			extensions: ['.js', '.json', '.vue'],
		},

		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin({ sourceMap: true })],
		},

		plugins: [
			new CompressionPlugin(),
			new VueLoaderPlugin(),
			new CssExtractPlugin({
				filename: '../style/style.bundle.css',
				ignoreOrder: false,
			}),
			new CopyWebpackPlugin([{ from: 'src/public/index.html', to: '../index.html' }]),
		],

		mode: prod ? 'production' : 'development',
		externals: prod ? {
			// 'vue' to resolve to external cdn
			vue: 'Vue',
		} : undefined,
		devtool: prod ? undefined : 'source-map'
	};

	return config;
};
