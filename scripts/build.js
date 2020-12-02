/**
 * 
 * Documentation
 * https://stackoverflow.com/questions/49123097/generate-single-physical-javascript-file-using-create-react-app
 * 
 */
"use strict";
const rewire = require("rewire");
const webpack = require("webpack");
const defaults = rewire("react-scripts/scripts/build.js");
const config = defaults.__get__("config");

config.output.filename = "react-swagger.js";
delete config.output.chunkFilename;

// Consolidate chunk files instead
config.optimization.splitChunks = {
	cacheGroups: {
		default: false
	},
};

// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false;

/**
 * 
 * Remove useless plugins and add the limit chunk count plugin
 * 
 */
config.plugins = [].concat(
	config.plugins.filter(plugin => (
		!["MiniCssExtractPlugin"].includes(plugin.constructor.name)
	)),
	[
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	]
);

/**
 * 
 * Disable MiniCssExtractPlugin
 * 
 */
config.module.rules[1].oneOf = config.module.rules[1].oneOf.map(rule => {

	if (!rule.hasOwnProperty("use"))
		return rule;

	return Object.assign(
		{},
		rule, {
		use: rule.use.map(options => /mini-css-extract-plugin/.test(options.loader)
			? { loader: require.resolve("style-loader"), options: {} }
			: options)
	});

});

