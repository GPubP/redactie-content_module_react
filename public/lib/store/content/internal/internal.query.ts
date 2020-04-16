import { QueryEntity } from '@datorama/akita';

import { ContentInternalState } from './internal.model';
import { ContentInternalStore, contentInternalStore } from './internal.store';

export class ContentInternalQuery extends QueryEntity<ContentInternalState> {
	public all$ = this.selectAll();
	public active$ = this.selectActive();

	constructor(protected store: ContentInternalStore) {
		super(store);
	}
}

export const contentInternalQuery = new ContentInternalQuery(contentInternalStore);
