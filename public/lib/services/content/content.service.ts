import { api, parseSearchParams, SearchParams } from '../api';

import { CONTENT_PREFIX_URL } from './content.service.const';
import { ContentCreateSchema, ContentSchema, ContentsSchema } from './content.service.types';

export const getContent = async (
	contentSearchParams: SearchParams
): Promise<ContentsSchema | null> => {
	try {
		const response: ContentsSchema = await api
			.get(`${CONTENT_PREFIX_URL}?${parseSearchParams(contentSearchParams)}`)
			.json();

		if (!response) {
			throw new Error('Failed to get content items');
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const createContent = async (data: ContentCreateSchema): Promise<ContentSchema | null> => {
	try {
		const response: any = await api.post(CONTENT_PREFIX_URL, {
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
		const response: any = await api.put(`${CONTENT_PREFIX_URL}/${uuid}`, {
			json: data,
		});

		return response;
	} catch (err) {
		return null;
	}
};

export const getContentItem = async (uuid: string): Promise<ContentSchema | null> => {
	try {
		const response: ContentSchema = await api.get(`${CONTENT_PREFIX_URL}/${uuid}`).json();

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
