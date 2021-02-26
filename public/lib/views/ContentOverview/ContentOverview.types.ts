import { CRUDSecurityRights } from '../../content.types';

export interface ContentOverviewTableRow {
	label?: string;
	description?: string;
	contentType?: string;
	lastModified?: string;
	lastEditor?: {
		firstname?: string;
		lastname?: string;
	};
	status?: string;
	published?: boolean;
	navigate: (path: string) => void;
	viewPath: string;
	securityRights: CRUDSecurityRights;
}

export enum FilterKeys {
	SEARCH = 'search',
	DATE = 'date',
	STATUS = 'status',
	PUBLISHED = 'published',
	CREATOR = 'creator',
	CONTENT_TYPE = 'contentType',
}
