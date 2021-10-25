import { SiteDetailModel } from '@redactie/sites-module';
import { WorkflowDetailModel } from '@redactie/workflows-module';

import { ContentModel, ContentSchema, ContentTypeSchema } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';

export interface ContentDetailMatchProps {
	siteId: string;
	contentId: string;
	contentTypeId: string;
}

export interface ContentDetailChildRouteProps<T = ContentDetailMatchProps>
	extends ContentRouteProps<T> {
	contentType: ContentTypeSchema;
	contentItemDraft: ContentSchema;
	contentItem: ContentSchema;
	canUpdate: boolean;
	canDelete: boolean;
	workflow: WorkflowDetailModel;
}

export interface ExternalActionProps {
	site: SiteDetailModel;
	contentItem: ContentModel;
	isLoading: boolean;
}
