import { BaseEntityState } from '@redactie/utils';

import { ContentTypePaging, ContentTypeSchema } from '../../services/contentTypes';

export type ContentTypeModel = ContentTypeSchema;

export interface ContentTypesState extends BaseEntityState<ContentTypeModel, string> {
	meta?: ContentTypePaging;
	contentType?: ContentTypeModel;
}
