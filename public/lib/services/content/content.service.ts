import { api, parseSearchParams, SearchParams } from '../api';
import { SITE_REQUEST_PREFIX_URL } from '../api/api.service.const';

import { CONTENT_STATUS_API_MAP } from './content.service.const';
import {
	ContentCreateSchema,
	ContentSchema,
	ContentsSchema,
	ContentStatus,
} from './content.service.types';

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
			const response: any = await api
				.post(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content`, {
					json: data,
				})
				.json();

			return response;
		} catch (err) {
			return null;
		}
	}

	public async updateContentItem(
		siteId: string,
		uuid: string,
		data: ContentSchema
	): Promise<ContentSchema | null> {
		const type =
			CONTENT_STATUS_API_MAP[data.meta.status as ContentStatus] ||
			CONTENT_STATUS_API_MAP[ContentStatus.DRAFT];

		try {
			const response: any = await api
				.put(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}/${type}`, {
					json: data,
				})
				.json();

			return response;
		} catch (err) {
			return null;
		}
	}

	public async getContentItem(siteId: string, uuid: string): Promise<ContentSchema | null> {
		try {
			const response: ContentSchema = await api
				.get(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}/history/latest`)
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export const contentApiService = new ContentApiService();
