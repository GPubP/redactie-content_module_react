import { ID } from '@datorama/akita';

import { ContentInternalModel } from './internal.model';
import { contentInternalStore, ContentInternalStore } from './internal.store';

export class ContentInternalService {
	constructor(private store: ContentInternalStore) {}

	public register(data: ContentInternalModel | ContentInternalModel[]): void {
		const contents = Array.isArray(data) ? data : [data];

		contents.forEach(content => {
			this.store.upsert(content.uuid || 'new', content);
		});
	}

	public clearContent(): void {
		this.store.reset();
	}

	public setActive(name: ID): void {
		this.store.setActive(name);
	}
}

export const contentInternalService = new ContentInternalService(contentInternalStore);
