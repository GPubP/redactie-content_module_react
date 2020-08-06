import { isNil } from '@datorama/akita';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { BaseEntityQuery } from '../shared';

import { ContentState } from './content.model';
import { ContentStore, contentStore } from './content.store';

export class ContentQuery extends BaseEntityQuery<ContentState> {
	constructor(protected store: ContentStore) {
		super(store);
	}

	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public content$ = this.selectAll();
	public contentItem$ = this.select(state => state.contentItem).pipe(
		filter(contentItem => !isNil(contentItem), distinctUntilChanged())
	);
	public contentItemDraft$ = this.select(state => state.contentItemDraft).pipe(
		filter(contentItemDraft => !isNil(contentItemDraft), distinctUntilChanged())
	);
}

export const contentQuery = new ContentQuery(contentStore);
