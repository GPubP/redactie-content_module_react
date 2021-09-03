export interface ContentCreateOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	type: string;
	navigate: (contentTypeId: string) => void;
}
