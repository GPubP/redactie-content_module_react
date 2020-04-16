import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	ContentCompartmentModel,
	ContentCompartmentState,
	createInitialContentCompartmentState,
} from './compartments.model';

@StoreConfig({ name: 'contentCompartments', idKey: 'name', resettable: true })
export class ContentCompartmentStore extends EntityStore<
	ContentCompartmentState,
	ContentCompartmentModel
> {
	constructor() {
		super(createInitialContentCompartmentState());
	}
}

export const contentCompartmentStore = new ContentCompartmentStore();
