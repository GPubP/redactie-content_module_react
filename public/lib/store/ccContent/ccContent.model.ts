import { ContentSchema, PagingSchema } from '../../services/content';
import { BaseEntityState } from '../shared';

export type CcContentModel = ContentSchema;

export interface CcContentState extends BaseEntityState<CcContentModel, string> {
	meta?: PagingSchema;
	contentItem?: CcContentModel;
}
