import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	ContentInternalModel,
	ContentInternalState,
	createInitialContentInternalState,
} from './internal.model';

@StoreConfig({ name: 'content', idKey: 'uuid', resettable: true })
export class ContentInternalStore extends EntityStore<ContentInternalState, ContentInternalModel> {
	constructor() {
		super(createInitialContentInternalState());
	}
}

export const contentInternalStore = new ContentInternalStore();
