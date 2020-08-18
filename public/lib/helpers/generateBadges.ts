import { ContentSchema } from '../api/api.types';
import { ContextHeaderBadge } from '../content.types';
import { ContentStatus } from '../services/content';

const STATUS_LABEL_MAP = {
	[ContentStatus.DRAFT]: 'Werkversie',
	[ContentStatus.PENDING]: 'In afwachting',
	[ContentStatus.SCHEDULED]: 'Gepland',
};

type AllowedStatus = ContentStatus.DRAFT | ContentStatus.PENDING | ContentStatus.SCHEDULED;

export const generateDetailBadges = (
	contentItem: ContentSchema | undefined
): ContextHeaderBadge[] => {
	if (!contentItem) {
		return [];
	}

	const { contentType, published } = contentItem.meta;
	const status = contentItem.meta.status as ContentStatus;

	const contentTypeLabel = contentType.meta.label;
	const statusLabel = status ? STATUS_LABEL_MAP[status as AllowedStatus] : '';

	const contentTypeBadge: ContextHeaderBadge = { name: contentTypeLabel, type: 'primary' };
	const statusBadge: ContextHeaderBadge = { name: statusLabel, type: 'primary' };
	const publishedBadge: ContextHeaderBadge = {
		name: published ? 'Online' : 'Offline',
		type: published ? 'success' : 'danger',
	};

	const showStatusBadge = ![ContentStatus.PUBLISHED, ContentStatus.UNPUBLISHED].includes(status);

	return [
		...(contentTypeLabel ? [contentTypeBadge] : []),
		...(showStatusBadge ? [statusBadge] : []),
		publishedBadge,
	];
};
