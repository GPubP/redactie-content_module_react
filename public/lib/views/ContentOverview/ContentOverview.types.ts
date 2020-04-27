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
