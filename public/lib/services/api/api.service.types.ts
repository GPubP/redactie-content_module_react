export interface SearchParams {
	skip: number;
	limit: number;
	search?: string;
	sort?: string;
	direction?: number;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
