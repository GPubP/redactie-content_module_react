export interface ContentOverviewTableRow {
	id: string;
	label?: string;
	contentType?: string;
	lastModified?: string;
	lastEditor?: string;
	status?: string;
	published?: boolean;
	navigate: (contentId: string) => void;
}

export enum FilterKeys {
	SEARCH = 'search',
	DATE = 'date',
	STATUS = 'status',
	PUBLISHED = 'published',
	CREATOR = 'creator',
	CONTENT_TYPE = 'contentType',
}
