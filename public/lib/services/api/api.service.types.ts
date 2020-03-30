export interface SearchParams {
	page: number;
	pagesize: number;
	sort?: string;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
