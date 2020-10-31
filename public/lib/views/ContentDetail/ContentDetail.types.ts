import { ContentSchema, ContentTypeSchema } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';
import { LockModel } from '../../store/locks';

export interface ContentDetailMatchProps {
	siteId: string;
	contentId: string;
}

export interface ContentDetailChildRouteProps<T = ContentDetailMatchProps>
	extends ContentRouteProps<T> {
	contentType: ContentTypeSchema;
	contentItemDraft: ContentSchema;
	contentItem: ContentSchema;
	lock?: LockModel;
}
