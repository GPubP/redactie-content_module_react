import { isNil } from '@datorama/akita';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { BaseEntityQuery } from '../shared';

import { CcContentState } from './ccContent.model';
import { ccContentStore } from './ccContent.store';

export class CcContentQuery extends BaseEntityQuery<CcContentState> {
	public content$ = this.selectAll();
	public contentItem$ = this.select(state => state.contentItem).pipe(
		filter(contentItem => !isNil(contentItem), distinctUntilChanged())
	);
}

export const ccContentQuery = new CcContentQuery(ccContentStore);
