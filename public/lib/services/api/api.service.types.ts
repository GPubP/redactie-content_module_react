export interface SearchParams {
	page: number;
	pagesize: number;
	sort?: string;
	search?: string;
	contentTypes?: string;
	creator?: string;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
