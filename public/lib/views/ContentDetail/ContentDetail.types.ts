import { SiteDetailModel } from '@redactie/sites-module';

import { ContentModel, ContentSchema, ContentTypeSchema } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';

export interface ContentDetailMatchProps {
	siteId: string;
	contentId: string;
}

export interface ContentDetailChildRouteProps<T = ContentDetailMatchProps>
	extends ContentRouteProps<T> {
	contentType: ContentTypeSchema;
	contentItemDraft: ContentSchema;
	contentItem: ContentSchema;
	canUpdate: boolean;
}

export interface ExternalActionProps {
	site: SiteDetailModel;
	contentItem: ContentModel;
	isLoading: boolean;
}
