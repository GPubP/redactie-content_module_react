import { ContentSchema, ContentTypeSchema } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';

export interface ContentDetailMatchProps {
	siteId: string;
	contentId: string;
}

export interface ContentDetailChildRouteProps<T = ContentDetailMatchProps>
	extends ContentRouteProps<T> {
	contentType: ContentTypeSchema;
	contentItemDraft: ContentSchema;
}
