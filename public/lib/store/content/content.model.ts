import { ContentSchema, PagingSchema } from '../../services/content';
import { BaseEntityState } from '../shared';

export type ContentModel = ContentSchema;

export interface ContentState extends BaseEntityState<ContentModel, string> {
	meta?: PagingSchema;
	contentItem?: ContentModel;
	contentItemDraft?: ContentModel;
}
