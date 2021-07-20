import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	createInitialExternalActionsState,
	ExternalActionModel,
	ExternalActionsState,
} from './externalActions.model';

@StoreConfig({ name: 'externalActions', idKey: 'name' })
export class ExternalActionsStore extends EntityStore<ExternalActionsState, ExternalActionModel> {
	constructor() {
		super(createInitialExternalActionsState());
	}
}

export const externalActionsStore = new ExternalActionsStore();
