export interface SearchParams {
	page: number;
	pagesize: number;
	sort?: string;
	search?: string;
	contentTypes?: Array<string>;
	publishedFrom?: string;
	publishedTo?: string;
	status?: string;
	creator?: string;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
