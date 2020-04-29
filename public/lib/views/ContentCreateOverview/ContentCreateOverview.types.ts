export interface ContentCreateOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	navigate: (contentTypeId: string) => void;
}
