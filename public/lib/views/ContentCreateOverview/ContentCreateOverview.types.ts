export interface ContentCreateOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	type: string;
	onSelectContentType: (contentTypeId: string) => void;
}
