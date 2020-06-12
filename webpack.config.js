const path = require('path');

const RedactionWebpackPlugin = require('@redactie/module-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packageJSON = require('./package.json');

module.exports = env => {
	const defaultConfig = {
		mode: 'production',
		devtool: 'source-map',
		entry: './public/index.tsx',
		performance: {
			hints: false,
		},
		module: {
			rules: [
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
								plugins: () => [postcssPresetEnv()],
							},
						},
						'sass-loader',
					],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		plugins: [
			// add default plugins here
		],
		externals: {
			react: 'react',
			formik: 'formik',
			ky: 'ky',
			yup: 'yup',
			ramda: 'ramda',
			rxjs: 'rxjs',
			moment: 'moment',
			'rxjs/operators': 'rxjs/operators',
			'@datorama/akita': '@datorama/akita',
			'react-dom': 'react-dom',
			'react-router-dom': 'react-router-dom',
			'react-router-guards': 'react-router-guards',
			'@redactie/redactie-core': '@redactie/redactie-core',
			'@redactie/roles-rights-module': '@redactie/roles-rights-module',
			'@acpaas-ui/react-components': '@acpaas-ui/react-components',
			'@acpaas-ui/react-editorial-components': '@acpaas-ui/react-editorial-components',
		},
		output: {
			filename: 'redactie-content-module.umd.js',
			path: path.resolve(__dirname, 'dist'),
			libraryTarget: 'umd',
		},
	};

	if (env.analyse) {
		return {
			...defaultConfig,
			plugins: [...defaultConfig.plugins, new BundleAnalyzerPlugin()],
		};
	}

	if (env.prod) {
		return {
			...defaultConfig,
			plugins: [
				...defaultConfig.plugins,
				new RedactionWebpackPlugin({
					moduleName: packageJSON.name,
				}),
			],
		};
	}

	return defaultConfig;
};
