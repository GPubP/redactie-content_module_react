import { ModuleSettings } from '../../services/content';
import { ContentModel } from '../../store/content';

export interface SiteUpdateMatchProps {
	tab: string;
}

export interface ExternalStandaloneTabValue {}

export interface ExternalTabValue {
	config: ModuleSettings['config'];
	validationSchema: ModuleSettings['validationSchema'];
}

export interface ExternalTabProps {
	contentId: string;
	siteId: string;
	contentItem: ContentModel;
	value: ExternalStandaloneTabValue | ExternalTabValue;
	isLoading: boolean;
	onSubmit: (value: ExternalTabValue) => void;
	onCancel: () => void;
	updateContentItem: (e: ContentModel) => void;
}

export interface ContentDetailExternalMatchProps {
	tab: string;
	contentId: string;
	siteId: string;
}
