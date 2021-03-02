import { BaseEntityState } from '@redactie/utils';

import { PagingSchema } from '../../content.types';
import { ContentTypeSchema } from '../../services/contentTypes';

export type ContentTypeModel = ContentTypeSchema;

export interface ContentTypesState extends BaseEntityState<ContentTypeModel, string> {
	meta?: PagingSchema;
	contentType?: ContentTypeModel;
}
