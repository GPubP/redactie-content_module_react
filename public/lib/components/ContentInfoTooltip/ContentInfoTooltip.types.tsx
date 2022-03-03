export interface ContentInfoTooltipProps {
	icon: string;
	meta: {
		label: string;
		slug: Record<string, string>;
		site: string;
		description?: string;
		historySummary?: {
			published: boolean;
		};
		lastEditor?: {
			firstname?: string;
			lastname?: string;
		};
		status: string;
		created?: string;
		lastModified?: string;
		firstPublished?: string;
	};
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
