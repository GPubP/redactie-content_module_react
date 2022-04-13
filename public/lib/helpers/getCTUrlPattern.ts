import { SiteResponse } from '@redactie/sites-module';

import { ContentTypeSchema, ModuleSettings } from '../services/contentTypes';

export const getCTUrlPattern = (
	contentType: ContentTypeSchema,
	activeLanguage: string,
	moduleConfigName: string,
	site?: SiteResponse
): string => {
	const fallbackPath = '/[item:slug]';

	if (!contentType?.modulesConfig || !activeLanguage) {
		return '';
	}

	let config = (contentType?.modulesConfig || []).find(
		(moduleConfig: ModuleSettings) =>
			moduleConfig.site === site?.uuid && moduleConfig.name === moduleConfigName
	);

	if (!config) {
		config = (contentType?.modulesConfig || []).find(
			(moduleConfig: ModuleSettings) => moduleConfig.name === moduleConfigName
		);
	}

	if (!config) {
		return contentType.meta.urlPath?.pattern || fallbackPath;
	}

	return config?.config?.url?.urlPattern[activeLanguage] || fallbackPath;
};
