import { SearchParams } from '../api';

import { ContentStatus } from './content.service.types';

export const DEFAULT_CONTENT_SEARCH_PARAMS: SearchParams = {
	skip: 0,
	limit: 10,
};

export const CONTENT_STATUS_TRANSLATION_MAP = {
	[ContentStatus.DRAFT]: 'Werkversie',
	[ContentStatus.PUBLISHED]: 'Gepubliceerd',
	[ContentStatus.SCHEDULED]: 'Gepland',
	[ContentStatus.PENDING]: 'In wacht',
	[ContentStatus.UNPUBLISHED]: 'Niet Gepubliceerd',
};

export const CONTENT_STATUS_API_MAP = {
	[ContentStatus.DRAFT]: 'draft',
	[ContentStatus.PENDING]: 'pending',
	[ContentStatus.SCHEDULED]: 'scheduled',
	[ContentStatus.PUBLISHED]: 'published',
	[ContentStatus.UNPUBLISHED]: 'unpublish',
};
