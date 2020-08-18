import { ContentSchema } from '../api/api.types';
import { STATUS_LABEL_MAP } from '../content.const';
import { ContextHeaderBadge } from '../content.types';
import { ContentStatus } from '../services/content';

export const generateDetailBadges = (
	contentItem: ContentSchema | undefined
): ContextHeaderBadge[] => {
	if (!contentItem) {
		return [];
	}

	const { contentType, published } = contentItem.meta;
	const status = contentItem.meta.status as ContentStatus;

	const contentTypeLabel = contentType.meta.label;
	const statusLabel = status ? STATUS_LABEL_MAP[status] : '';

	const contentTypeBadge: ContextHeaderBadge = { name: contentTypeLabel, type: 'primary' };
	const statusBadge: ContextHeaderBadge = { name: statusLabel, type: 'primary' };
	const publishedBadge: ContextHeaderBadge = {
		name: published ? STATUS_LABEL_MAP.PUBLISHED : STATUS_LABEL_MAP.UNPUBLISHED,
		type: published ? 'success' : 'danger',
	};

	const showStatusBadge = ![ContentStatus.PUBLISHED, ContentStatus.UNPUBLISHED].includes(status);

	return [
		...(contentTypeLabel ? [contentTypeBadge] : []),
		...(showStatusBadge ? [statusBadge] : []),
		publishedBadge,
	];
};
