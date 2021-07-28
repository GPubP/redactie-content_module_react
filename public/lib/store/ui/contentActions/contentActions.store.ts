import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	ContentActionModel,
	ContentActionsState,
	createInitialContentActionsState,
} from './contentActions.model';

@StoreConfig({ name: 'contentActions', idKey: 'name', resettable: true })
export class ContentActionStore extends EntityStore<ContentActionsState, ContentActionModel> {
	constructor() {
		super(createInitialContentActionsState());
	}
}

export const contentActionStore = new ContentActionStore();
