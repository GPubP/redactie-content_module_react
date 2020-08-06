import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { ContentTypeModel, ContentTypesState } from './contentTypes.model';

@StoreConfig({ name: 'contentTypes', idKey: 'uuid' })
export class ContentTypesStore extends BaseEntityStore<ContentTypesState, ContentTypeModel> {
	constructor() {
		super();
	}
}

export const contentTypesStore = new ContentTypesStore();
