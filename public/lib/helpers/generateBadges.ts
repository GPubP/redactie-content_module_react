import { ContextHeaderBadge } from '@redactie/utils';

import { ContentSchema } from '../api/api.types';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../services/content';

export const generateDetailBadges = (
	contentItem: ContentSchema | undefined
): ContextHeaderBadge[] => {
	if (!contentItem) {
		return [];
	}

	const { contentType, historySummary } = contentItem.meta;
	const status = contentItem.meta.status as ContentStatus;

	const contentTypeLabel = contentType.meta.label;
	const statusLabel = status ? CONTENT_STATUS_TRANSLATION_MAP[status] : '';

	const contentTypeBadge: ContextHeaderBadge = { name: contentTypeLabel, type: 'primary' };
	const statusBadge: ContextHeaderBadge = { name: statusLabel, type: 'primary' };
	const publishedBadge: ContextHeaderBadge = {
		name: historySummary?.published ? 'Online' : 'Offline',
		type: historySummary?.published ? 'success' : 'danger',
	};

	const showStatusBadge = ![ContentStatus.PUBLISHED, ContentStatus.UNPUBLISHED].includes(status);

	return [
		...(contentTypeLabel ? [contentTypeBadge] : []),
		...(showStatusBadge ? [statusBadge] : []),
		publishedBadge,
	];
};
