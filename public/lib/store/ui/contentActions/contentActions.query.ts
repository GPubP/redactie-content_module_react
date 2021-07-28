import { QueryEntity } from '@datorama/akita';

import { ContentActionsState } from './contentActions.model';
import { ContentActionStore, contentActionStore } from './contentActions.store';

export class ContentActionsQuery extends QueryEntity<ContentActionsState> {
	public all$ = this.selectAll();

	constructor(protected store: ContentActionStore) {
		super(store);
	}
}

export const contentActionsQuery = new ContentActionsQuery(contentActionStore);
