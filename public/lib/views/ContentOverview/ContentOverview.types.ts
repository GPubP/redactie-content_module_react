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

export interface OrderBy {
	key: string;
	order: string;
}

export enum FilterKeys {
	SEARCH = 'search',
	DATE = 'date',
	STATUS = 'status',
	ONLINE = 'online',
	AUTHOR = 'author',
	THEME = 'theme',
	CONTENT_TYPE = 'contentType',
}
