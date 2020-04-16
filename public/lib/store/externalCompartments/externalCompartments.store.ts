import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	createInitialExternalCompartmentsState,
	ExternalCompartmentModel,
	ExternalCompartmentsState,
} from './externalCompartments.model';

@StoreConfig({ name: 'externalCompartments', idKey: 'name' })
export class ExternalCompartmentsStore extends EntityStore<
	ExternalCompartmentsState,
	ExternalCompartmentModel
> {
	constructor() {
		super(createInitialExternalCompartmentsState());
	}
}

export const externalCompartmentsStore = new ExternalCompartmentsStore();
