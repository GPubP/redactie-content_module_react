import { SearchParams } from '@redactie/utils';

export const CONTENT_TYPES_PREFIX_URL = 'content/v1/content-types';

export const DEFAULT_CONTENT_TYPES_SEARCH_PARAMS: SearchParams & { limit: number } = {
	skip: 0,
	limit: -1,
	sparse: true,
	sort: 'meta.label',
	direction: 1,
};
