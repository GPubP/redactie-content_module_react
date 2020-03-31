import { ContentSchema, ContentsSchema } from './content.types';
import apiService from './services/api/api.service';

export const getContent = async (): Promise<ContentSchema[] | null> => {
	try {
		const response: ContentsSchema = await apiService.get('content').json();
		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
