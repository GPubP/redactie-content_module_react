import { isNil } from '@datorama/akita';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { BaseEntityQuery } from '../shared';

import { ContentTypesState } from './contentTypes.model';
import { contentTypesStore } from './contentTypes.store';

export class ContentTypesQuery extends BaseEntityQuery<ContentTypesState> {
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public contentTypes$ = this.selectAll();
	public contentType$ = this.select(state => state.contentType).pipe(
		filter(contentType => !isNil(contentType), distinctUntilChanged())
	);
}

export const contentTypesQuery = new ContentTypesQuery(contentTypesStore);
