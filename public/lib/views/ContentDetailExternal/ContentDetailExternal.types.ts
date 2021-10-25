import { WorkflowDetailModel } from '@redactie/workflows-module';

import { ContentTypeSchema } from '../../api/api.types';
import { ModuleSettings } from '../../services/content';
import { ContentModel } from '../../store/content';

export interface SiteUpdateMatchProps {
	tab: string;
}

export type ExternalStandaloneTabValue = Record<string, unknown>;

export interface ExternalTabValue {
	config: ModuleSettings['config'];
	validationSchema: ModuleSettings['validationSchema'];
}

export interface ExternalTabProps {
	contentId: string;
	siteId: string;
	contentType: ContentTypeSchema;
	contentItem: ContentModel;
	value: ExternalStandaloneTabValue | ExternalTabValue;
	isLoading: boolean;
	onSubmit: (value: ExternalTabValue) => void;
	onCancel: () => void;
	updateContentItem: (e: ContentModel) => void;
	workflow: WorkflowDetailModel;
}

export interface ContentDetailExternalMatchProps {
	tab: string;
	contentId: string;
	siteId: string;
	contentType: ContentTypeSchema;
}
