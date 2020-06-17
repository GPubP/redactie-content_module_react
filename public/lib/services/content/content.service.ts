import { api, parseSearchParams, SearchParams } from '../api';
import { SITE_REQUEST_PREFIX_URL } from '../api/api.service.const';

import { ContentCreateSchema, ContentSchema, ContentsSchema } from './content.service.types';

export const getContent = async (
	siteId: string,
	contentSearchParams: SearchParams
): Promise<ContentsSchema | null> => {
	try {
		const response: ContentsSchema = await api
			.get(
				`${SITE_REQUEST_PREFIX_URL}/${siteId}/content?${parseSearchParams(
					contentSearchParams
				)}`
			)
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

export const createContent = async (
	siteId: string,
	data: ContentCreateSchema
): Promise<ContentSchema | null> => {
	try {
		const response: any = await api.post(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content`, {
			json: data,
		});

		return response;
	} catch (err) {
		return null;
	}
};

export const updateContent = async (
	siteId: string,
	uuid: string,
	data: ContentSchema
): Promise<ContentSchema | null> => {
	try {
		const response: any = await api.put(
			`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}`,
			{
				json: data,
			}
		);

		return response;
	} catch (err) {
		return null;
	}
};

export const getContentItem = async (
	siteId: string,
	uuid: string
): Promise<ContentSchema | null> => {
	console.log(SITE_REQUEST_PREFIX_URL);
	try {
		const response: ContentSchema = await api
			.get(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}`)
			.json();

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
