import apiService from '../api/api.service';

import { ContentTypeSchema } from './contentTypes.types';

export const getContentType = async (uuid: string): Promise<ContentTypeSchema | null> => {
	try {
		const response: ContentTypeSchema = await apiService.get(`content-types/${uuid}`).json();

		if (!response.fields) {
			throw new Error('Failed to get content type');
		}

		const validateSchema = {
			$schema: 'http://json-schema.org/draft-07/schema#',
			type: 'object',
			properties: response.validateSchema || {},
		};
		const errorMessages = response.errorMessages || {};
		return {
			...response,
			validateSchema,
			errorMessages,
		};
	} catch (err) {
		console.error(err);
		return null;
	}
};
