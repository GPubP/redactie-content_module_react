import { api, parseSearchParams, SearchParams } from '../api';
import { SITE_REQUEST_PREFIX_URL } from '../api/api.service.const';

import { ContentCreateSchema, ContentSchema, ContentsSchema } from './content.service.types';

export class ContentApiService {
	public async getContent(
		siteId: string,
		contentSearchParams: SearchParams
	): Promise<ContentsSchema | null> {
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
	}

	public async createContentItem(
		siteId: string,
		data: ContentCreateSchema
	): Promise<ContentSchema | null> {
		try {
			const response: any = await api.post(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content`, {
				json: data,
			});

			return response;
		} catch (err) {
			return null;
		}
	}

	public async updateContentItem(
		siteId: string,
		uuid: string,
		data: ContentSchema,
		publish = false
	): Promise<ContentSchema | null> {
		const url = publish
			? `${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}/publish`
			: `${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}`;

		try {
			const response: any = await api.put(url, {
				json: data,
			});

			return response;
		} catch (err) {
			return null;
		}
	}

	public async getContentItem(siteId: string, uuid: string): Promise<ContentSchema | null> {
		try {
			const response: ContentSchema = await api
				.get(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}`)
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export const contentApiService = new ContentApiService();
