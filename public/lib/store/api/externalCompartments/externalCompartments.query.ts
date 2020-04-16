import { QueryEntity } from '@datorama/akita';

import { ExternalCompartmentsState } from './externalCompartments.model';
import { ExternalCompartmentsStore, externalCompartmentsStore } from './externalCompartments.store';

export class ExternalCompartmentsQuery extends QueryEntity<ExternalCompartmentsState> {
	all$ = this.selectAll();

	constructor(protected store: ExternalCompartmentsStore) {
		super(store);
	}
}

export const externalCompartmentsQuery = new ExternalCompartmentsQuery(externalCompartmentsStore);
