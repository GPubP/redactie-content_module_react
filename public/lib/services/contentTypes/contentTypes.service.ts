import { api, parseSearchParams, SearchParams } from '../api';

import {
	CONTENT_TYPES_PREFIX_URL,
	DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
} from './contentTypes.service.const';
import { ContentTypeSchema, ContentTypesSchema } from './contentTypes.service.types';

// TODO: This data should come from the content type module API
export const getContentType = async (uuid: string): Promise<ContentTypeSchema | null> => {
	try {
		const response: ContentTypeSchema = await api
			.get(`${CONTENT_TYPES_PREFIX_URL}/${uuid}`)
			.json();

		if (!response.fields) {
			throw new Error('Failed to get content type');
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const getContentTypes = async (): Promise<ContentTypeSchema[] | null> => {
	try {
		const response: any = await api.get(CONTENT_TYPES_PREFIX_URL).json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const getFilteredContentTypes = async (
	searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
): Promise<ContentTypesSchema | null> => {
	try {
		const response: ContentTypesSchema = await api
			.get(`${CONTENT_TYPES_PREFIX_URL}?${parseSearchParams(searchParams)}`)
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
