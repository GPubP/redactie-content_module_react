import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	createInitialExternalTabsState,
	ExternalTabModel,
	ExternalTabsState,
} from './externalTabs.model';

@StoreConfig({ name: 'external-tabs', idKey: 'name' })
export class ExternalTabsStore extends EntityStore<ExternalTabsState, ExternalTabModel> {
	constructor() {
		super(createInitialExternalTabsState());
	}
}

export const externalTabsStore = new ExternalTabsStore();
