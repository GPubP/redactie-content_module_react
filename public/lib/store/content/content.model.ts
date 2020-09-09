import { BaseEntityState } from '@redactie/utils';

import { ContentSchema, PagingSchema } from '../../services/content';

export type ContentModel = ContentSchema;

export interface ContentState extends BaseEntityState<ContentModel, string> {
	meta?: PagingSchema;
	contentItem?: ContentModel;
	contentItemDraft?: ContentModel;
	isPublishing: boolean;
}
