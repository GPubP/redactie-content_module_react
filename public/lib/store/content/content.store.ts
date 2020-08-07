import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { ContentModel, ContentState } from './content.model';

@StoreConfig({ name: 'content', idKey: 'uuid', resettable: true })
export class ContentStore extends BaseEntityStore<ContentState, ContentModel> {}

export const contentStore = new ContentStore();
