export interface ContentOverviewTableRow {
	label?: string;
	description?: string;
	contentType?: string;
	lastModified?: string;
	lastEditor?: string;
	status?: string;
	published?: boolean;
	navigate: (path: string) => void;
	viewPath: string;
}

export enum FilterKeys {
	SEARCH = 'search',
	DATE = 'date',
	STATUS = 'status',
	PUBLISHED = 'published',
	CREATOR = 'creator',
	CONTENT_TYPE = 'contentType',
}
