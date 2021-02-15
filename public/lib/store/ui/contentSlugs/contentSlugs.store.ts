import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	ContentSlugModel,
	ContentSlugState,
	createInitialContentSlugState,
} from './contentSlugs.model';

@StoreConfig({ name: 'contentSlugs', idKey: 'slug', resettable: true })
export class ContentSlugStore extends EntityStore<ContentSlugState, ContentSlugModel> {
	constructor() {
		super(createInitialContentSlugState());
	}
}

export const contentSlugStore = new ContentSlugStore();
