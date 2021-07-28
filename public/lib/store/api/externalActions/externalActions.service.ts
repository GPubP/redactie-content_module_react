import { ID } from '@datorama/akita';

import { ExternalActionModel, ExternalActionOptions } from './externalActions.model';
import { ExternalActionsStore, externalActionsStore } from './externalActions.store';

export class ExternalActionsService {
	constructor(private store: ExternalActionsStore) {}

	public registerActions(name: string, options: ExternalActionOptions): void {
		const entity: ExternalActionModel = {
			name,
			module: options.module,
			component: options.component,
		};

		if (options.replace) {
			this.store.upsert(name, entity);
			return;
		}

		this.store.add(entity);
	}

	public activate(name: ID): void {
		this.store.setActive(name);
	}
}

export const externalActionsService = new ExternalActionsService(externalActionsStore);
