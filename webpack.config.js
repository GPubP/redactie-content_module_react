const path = require('path');

const { getWorkerConfig, getModuleConfig } = require('@redactie/utils/dist/webpack');

const packageJSON = require('./package.json');

module.exports = env => {
	const defaultConfig = getModuleConfig({
		packageJSON,
		mainEntryPath: path.resolve(__dirname, './public/index.tsx'),
		tsIncludes: [/public/, /node_modules\/@redactie\/translations-module/],
		sassIncludes: [/public/, /node_modules\/@a-ui\/core/],
		outputPath: path.resolve(__dirname, 'dist'),
	})(env);
	const workerConfig = getWorkerConfig();

	return [workerConfig, defaultConfig];
};
