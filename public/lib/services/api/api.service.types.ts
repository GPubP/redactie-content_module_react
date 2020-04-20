export interface SearchParams {
	page: number;
	pagesize: number;
	sort?: string;
	search?: Array<string>;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
