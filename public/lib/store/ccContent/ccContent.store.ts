import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { CcContentModel, CcContentState } from './ccContent.model';

@StoreConfig({ name: 'ccContent', idKey: 'uuid', resettable: true })
export class CcContentStore extends BaseEntityStore<CcContentState, CcContentModel> {
	constructor(initialState: Partial<CcContentState>) {
		super(initialState);
	}
}

export const ccContentStore = new CcContentStore({});
