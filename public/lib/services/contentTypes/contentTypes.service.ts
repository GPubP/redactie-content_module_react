import apiService from '../api/api.service';

import { ContentTypeSchema } from './contentTypes.service.types';

// TODO: This data should come from the content type module API
export const getContentType = async (uuid: string): Promise<ContentTypeSchema | null> => {
	try {
		const response: ContentTypeSchema = await apiService.get(`content-types/${uuid}`).json();

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
		const response: any = await apiService.get('content/content-types').json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
