import { api, parseSearchParams, SearchParams } from '../api';

import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from './contentTypes.service.const';
import { ContentTypeSchema, ContentTypesSchema } from './contentTypes.service.types';

// TODO: This data should come from the content type module API
export const getContentType = async (uuid: string): Promise<ContentTypeSchema | null> => {
	try {
		const response: ContentTypeSchema = await api.get(`content-types/${uuid}`).json();

		if (!response.fields) {
			throw new Error('Failed to get content type');
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

// TODO: This data should come from the content type module API
export const getContentTypes = async (
	searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
): Promise<ContentTypesSchema | null> => {
	try {
		const response: ContentTypesSchema = await api
			.get(`content-types?${parseSearchParams(searchParams)}`)
			.json();

		if (!response) {
			throw new Error('Failed to get content-types');
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
