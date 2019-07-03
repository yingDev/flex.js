const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: "./src/index.ts",
	output: {
		filename: "index.js"
	},
	mode: "production",
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					// disable type checker - we will use it in fork plugin
					//transpileOnly: true
				}
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			'package.json'
		])
	]
};