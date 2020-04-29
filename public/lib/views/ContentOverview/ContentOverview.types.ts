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
	AUTHOR = 'author',
	CONTENT_TYPE = 'contentType',
}
