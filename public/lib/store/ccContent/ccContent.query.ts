import { BaseMultiEntityQuery } from '@redactie/utils';

import { CcContentState } from './ccContent.model';
import { ccContentStore } from './ccContent.store';

export class CcContentQuery extends BaseMultiEntityQuery<CcContentState> {
	public content$ = this.selectAll();
}

export const ccContentQuery = new CcContentQuery(ccContentStore);
