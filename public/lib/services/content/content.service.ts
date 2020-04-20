import { api, parseSearchParams, SearchParams } from '../api';

import { DEFAULT_VIEWS_SEARCH_PARAMS } from './content.service.const';
import { ContentCreateSchema, ContentSchema, ContentsSchema } from './content.service.types';

export const getContent = async (
	searchParams: SearchParams = DEFAULT_VIEWS_SEARCH_PARAMS
): Promise<ContentsSchema | null> => {
	try {
		const response: ContentsSchema = await api
			.get(`content/content?${parseSearchParams(searchParams)}`)
			.json();

		if (!response.data) {
			throw new Error('Failed to get content');
		}

		return {
			data: response.data,
		};
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const createContent = async (data: ContentCreateSchema): Promise<ContentSchema | null> => {
	try {
		const response: any = await api.post('content', {
			json: data,
		});

		return response;
	} catch (err) {
		return null;
	}
};

export const updateContent = async (
	uuid: string,
	data: ContentSchema
): Promise<ContentSchema | null> => {
	try {
		const response: any = await api.put(`content/${uuid}`, {
			json: data,
		});

		return response;
	} catch (err) {
		return null;
	}
};

export const getContentItem = async (uuid: string): Promise<ContentSchema | null> => {
	try {
		const response: ContentSchema = await api.get(`content/${uuid}`).json();

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
