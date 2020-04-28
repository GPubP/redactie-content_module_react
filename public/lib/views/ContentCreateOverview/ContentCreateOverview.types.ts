export interface ContentCreateOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	navigate: (contentTypeId: string) => void;
}

export interface OrderBy {
	key: string;
	order: string;
}
