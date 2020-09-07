import { isNil } from '@datorama/akita';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { BaseEntityQuery } from '../shared';

import { ContentState } from './content.model';
import { contentStore } from './content.store';

export class ContentQuery extends BaseEntityQuery<ContentState> {
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
	public isPublishing$ = this.select(state => state.isPublishing).pipe(
		map(this.convertBoolToLoadingState)
	);
	public slugFieldTouched$ = this.select(state => state.slugFieldTouched);
}

export const contentQuery = new ContentQuery(contentStore);
