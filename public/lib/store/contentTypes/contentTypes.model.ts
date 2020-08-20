import { ContentTypePaging, ContentTypeSchema } from '../../services/contentTypes';
import { BaseEntityState } from '../shared';

export type ContentTypeModel = ContentTypeSchema;

export interface ContentTypesState extends BaseEntityState<ContentTypeModel, string> {
	meta?: ContentTypePaging;
	contentType?: ContentTypeModel;
}
