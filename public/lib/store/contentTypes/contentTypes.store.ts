import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { ContentTypeModel, ContentTypesState } from './contentTypes.model';

@StoreConfig({ name: 'contentTypes', idKey: 'uuid' })
export class ContentTypesStore extends BaseEntityStore<ContentTypesState, ContentTypeModel> {}

export const contentTypesStore = new ContentTypesStore();
