export interface ContentOverviewTableRow {
	label?: string;
	description?: string;
	contentType?: string;
	lastModified?: string;
	lastEditor?: {
		firstname?: string;
		lastname?: string;
	};
	status?: string;
	published?: boolean;
	navigate: (path: string) => void;
	viewPath: string;
	canUpdate: boolean;
	type: string;
}

export enum FilterKeys {
	SEARCH = 'search',
	DATE = 'date',
	STATUS = 'latest-status',
	PUBLISHED = 'published',
	CREATOR = 'creator',
	CONTENT_TYPE = 'contentType',
}
