import { QueryEntity } from '@datorama/akita';

import { ExternalTabsState } from './externalTabs.model';
import { ExternalTabsStore, externalTabsStore } from './externalTabs.store';

export class ExternalTabsQuery extends QueryEntity<ExternalTabsState> {
	public all$ = this.selectAll();
	public active$ = this.selectActive();

	constructor(protected store: ExternalTabsStore) {
		super(store);
	}
}

export const externalTabsQuery = new ExternalTabsQuery(externalTabsStore);
