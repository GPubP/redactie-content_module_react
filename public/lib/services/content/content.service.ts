import { api } from '../api';

import { ContentSchema, ContentsSchema, ContentCreateSchema } from './content.service.types';

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

		console.log(response);

		return response;
	} catch (err) {
		return null;
	}
};
