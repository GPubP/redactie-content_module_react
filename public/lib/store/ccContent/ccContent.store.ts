import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { CcContentModel, CcContentState } from './ccContent.model';

@StoreConfig({ name: 'ccContent', idKey: 'uuid', resettable: true })
export class CcContentStore extends BaseEntityStore<CcContentState, CcContentModel> {
	constructor(initialState: Partial<CcContentState>) {
		super(initialState);
	}

	public setIsPublishing(isPublishing = false): void {
		this.update({
			isPublishing,
		});
	}
}

export const ccContentStore = new CcContentStore({
	isPublishing: false,
});
