import { BaseEntityState } from '@redactie/utils';

import { PagingSchema } from '../../content.types';
import { ContentSchema } from '../../services/content';

export type ContentModel = ContentSchema;

export interface ContentState extends BaseEntityState<ContentModel, string> {
	meta?: PagingSchema;
	contentItem?: ContentModel;
	contentItemDraft?: ContentModel;
	isPublishing: boolean;
	isRemoving: boolean;
}
