import { ActiveState, EntityState } from '@datorama/akita';

import { ContentSchema } from '../../../api/api.types';

export type ContentInternalModel = ContentSchema;

export interface ContentInternalState
	extends EntityState<ContentInternalModel, string>,
		ActiveState {}

export const createInitialContentInternalState = (): ContentInternalState => ({
	active: null,
});
