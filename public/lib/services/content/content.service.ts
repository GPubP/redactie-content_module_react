import { parseSearchParams, SearchParams } from '@redactie/utils';

import { api } from '../api';
import { SITE_REQUEST_PREFIX_URL } from '../api/api.service.const';

import { CONTENT_STATUS_API_MAP } from './content.service.const';
import {
	ContentCreateSchema,
	ContentSchema,
	ContentsSchema,
	ContentStatus,
	ValidateSlugPayload,
} from './content.service.types';

export class ContentApiService {
	public getContent(
		siteId: string,
		contentSearchParams: SearchParams
	): Promise<ContentsSchema | null> {
		return api
			.get(
				`${SITE_REQUEST_PREFIX_URL}/${siteId}/content?${parseSearchParams(
					contentSearchParams
				)}`
			)
			.json();
	}

	public createContentItem(
		siteId: string,
		data: ContentCreateSchema
	): Promise<ContentSchema | null> {
		return api
			.post(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content`, {
				json: data,
			})
			.json();
	}

	public updateContentItem(
		siteId: string,
		uuid: string,
		data: ContentSchema
	): Promise<ContentSchema | null> {
		const type =
			CONTENT_STATUS_API_MAP[data.meta.status as ContentStatus] ||
			CONTENT_STATUS_API_MAP[ContentStatus.DRAFT];

		return api
			.put(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}/${type}`, {
				json: data,
			})
			.json();
	}

	public getContentItem(siteId: string, uuid: string): Promise<ContentSchema | null> {
		return api
			.get(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${uuid}/history/latest`)
			.json();
	}

	public validateSlug(siteId: string, payload: ValidateSlugPayload): Promise<void> {
		return api
			.post(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/slug/validate`, { json: payload })
			.json();
	}
}

export const contentApiService = new ContentApiService();
