import { QueryEntity } from '@datorama/akita';

import { ExternalActionsState } from './externalActions.model';
import { ExternalActionsStore, externalActionsStore } from './externalActions.store';

export class ExternalActionsQuery extends QueryEntity<ExternalActionsState> {
	public all$ = this.selectAll();

	constructor(protected store: ExternalActionsStore) {
		super(store);
	}
}

export const externalActionsQuery = new ExternalActionsQuery(externalActionsStore);
