import { QueryEntity } from '@datorama/akita';

import { ContentCompartmentState } from './compartments.model';
import { ContentCompartmentStore, contentCompartmentStore } from './compartments.store';

export class ContentCompartmentsQuery extends QueryEntity<ContentCompartmentState> {
	public all$ = this.selectAll();
	public active$ = this.selectActive();

	constructor(protected store: ContentCompartmentStore) {
		super(store);
	}
}

export const contentCompartmentsQuery = new ContentCompartmentsQuery(contentCompartmentStore);
