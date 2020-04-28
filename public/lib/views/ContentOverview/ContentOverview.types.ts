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
