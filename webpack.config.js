const path = require('path');

const RedactionWebpackPlugin = require('@redactie/module-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const cssnano = require('cssnano');
const kebabCase = require('lodash.kebabcase');
const postcssPresetEnv = require('postcss-preset-env');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packageJSON = require('./package.json');

module.exports = env => {
	const defaultConfig = {
		mode: 'production',
		entry: {
			[kebabCase(packageJSON.name)]: './public/index.tsx',
		},
		performance: {
			hints: false,
		},
		module: {
			rules: [
				{
					test: /\.worker\.ts$/,
					use: [
						{
							loader: 'worker-loader',
							options: {
								filename: '[name].umd.js',
							},
						},
					],
					include: [/public/],
				},
				{
					test: /\.ts(x)?$/,
					use: 'ts-loader',
					include: [/public/, /node_modules\/@redactie\/translations-module/],
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: () => [postcssPresetEnv(), cssnano({ preset: 'default' })],
							},
						},
						'sass-loader',
					],
					include: [/public/, /node_modules\/@a-ui\/core/],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		plugins: [
			// add default plugins here
			new CleanWebpackPlugin(),
			new webpack.DefinePlugin({
				BFF_MODULE_PUBLIC_PATH: JSON.stringify(
					`${kebabCase(packageJSON.name + packageJSON.version)}/dist/`
				),
			}),
		],
		externals: {
			react: 'react',
			formik: 'formik',
			// TODO: find solution for worker import of ky
			// ky: 'ky',
			yup: 'yup',
			ramda: 'ramda',
			rxjs: 'rxjs',
			moment: 'moment',
			'rxjs/operators': 'rxjs/operators',
			'@datorama/akita': '@datorama/akita',
			'react-dom': 'react-dom',
			'react-router-dom': 'react-router-dom',
			'@redactie/react-router-guards': '@redactie/react-router-guards',
			'@redactie/redactie-core': '@redactie/redactie-core',
			'@redactie/roles-rights-module': '@redactie/roles-rights-module',
			'@redactie/utils': '@redactie/utils',
			'@acpaas-ui/react-components': '@acpaas-ui/react-components',
			'@acpaas-ui/react-editorial-components': '@acpaas-ui/react-editorial-components',
		},
		output: {
			filename: '[name].umd.js',
			path: path.resolve(__dirname, 'dist'),
			libraryTarget: 'umd',
		},
	};

	if (env.analyse) {
		return {
			...defaultConfig,
			plugins: [
				...defaultConfig.plugins,
				new BundleAnalyzerPlugin(),
				new webpack.SourceMapDevToolPlugin({
					filename: '[name].umd.js.map',
					publicPath: `${kebabCase(packageJSON.name + packageJSON.version)}/dist/`,
				}),
			],
		};
	}

	if (env.prod) {
		return {
			...defaultConfig,
			plugins: [
				...defaultConfig.plugins,
				new RedactionWebpackPlugin({
					moduleName: packageJSON.name,
					exclude: [/worker\.umd\.js$/],
				}),
				new webpack.SourceMapDevToolPlugin({
					filename: '[name].umd.js.map',
					publicPath: `${kebabCase(packageJSON.name + packageJSON.version)}/dist/`,
				}),
			],
		};
	}

	return defaultConfig;
};
