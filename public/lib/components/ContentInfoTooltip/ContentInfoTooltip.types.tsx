export interface ContentInfoTooltipProps {
	contentId: string | undefined;
	icon: string;
}

export enum Status {
	NEW = 'NEW',
	DRAFT = 'DRAFT',
	PENDING_REVIEW = 'PENDING_REVIEW',
	PENDING_PUBLISH = 'PENDING_PUBLISH',
	SCHEDULED = 'SCHEDULED',
	PUBLISHED = 'PUBLISHED',
	UNPUBLISHED = 'UNPUBLISHED',
}
