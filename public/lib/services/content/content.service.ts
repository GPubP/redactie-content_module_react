import { api } from '../api';

import { ContentCreateSchema, ContentSchema, ContentsSchema } from './content.service.types';

export const getContent = async (): Promise<ContentSchema[] | null> => {
	try {
		const response: ContentsSchema = await api.get('content').json();
		return response.data;
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
