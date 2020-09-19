import { StoreConfig } from '@datorama/akita';
import { BaseMultiEntityStore } from '@redactie/utils';

import { CcContentState } from './ccContent.model';

@StoreConfig({ name: 'ccContent', idKey: 'id', resettable: true })
export class CcContentStore extends BaseMultiEntityStore<CcContentState> {
	constructor(initialState: Partial<CcContentState>) {
		super(initialState);
	}
}

export const ccContentStore = new CcContentStore({});
