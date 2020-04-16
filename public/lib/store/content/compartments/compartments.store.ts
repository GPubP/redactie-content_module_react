import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	ContentCompartmentModel,
	ContentCompartmentState,
	createInitialContentCompartmentState,
} from './compartments.model';

@StoreConfig({ name: 'externalCompartments', idKey: 'name' })
export class ContentCompartmentStore extends EntityStore<
	ContentCompartmentState,
	ContentCompartmentModel
> {
	constructor() {
		super(createInitialContentCompartmentState());
	}
}

export const contentCompartmentStore = new ContentCompartmentStore();
