export interface SearchParams {
	skip: number;
	limit: number;
	sort?: string;
	search?: string;
	contentTypes?: Array<string>;
	publishedFrom?: string;
	publishedTo?: string;
	status?: string;
	creator?: string;
	direction?: number;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
