import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { ContentModel, ContentState } from './content.model';

@StoreConfig({ name: 'content', idKey: 'uuid', resettable: true })
export class ContentStore extends BaseEntityStore<ContentState, ContentModel> {
	constructor(initialState: Partial<ContentState>) {
		super(initialState);
	}

	public setIsPublishing(isPublishing = false): void {
		this.update({
			isPublishing,
		});
	}

	public setIsRemoving(isRemoving = false): void {
		this.update({
			isRemoving,
		});
	}
}

export const contentStore = new ContentStore({
	isPublishing: false,
	isRemoving: false,
});
