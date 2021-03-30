import { parseSearchParams, SearchParams } from '@redactie/utils';

import { api } from '../api';
import { SITE_REQUEST_PREFIX_URL } from '../api/api.service.const';

import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from './contentTypes.service.const';
import { ContentTypeSchema, ContentTypesSchema } from './contentTypes.service.types';

// TODO: This data should come from the content type module API
export class ContentTypesApiService {
	public async getSiteContentTypes(
		siteId: string,
		searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	): Promise<ContentTypesSchema | null> {
		try {
			const response: ContentTypesSchema = await api
				.get(
					`${SITE_REQUEST_PREFIX_URL}/${siteId}/content-types?${parseSearchParams(
						searchParams
					)}`
				)
				.json();

			if (!response) {
				throw new Error('Failed to get content-types');
			}

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async getContentType(siteId: string, uuid: string): Promise<ContentTypeSchema | null> {
		try {
			const response: ContentTypeSchema = await api
				.get(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content-types/${uuid}?form=true`)
				.json();

			if (!response.fields) {
				throw new Error('Failed to get content type');
			}

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export const contentTypesApiService = new ContentTypesApiService();
