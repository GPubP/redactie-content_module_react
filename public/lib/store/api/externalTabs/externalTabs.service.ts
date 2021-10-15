import { ID } from '@datorama/akita';

import { ExternalTabModel, ExternalTabOptions } from './externalTabs.model';
import { ExternalTabsStore, externalTabsStore } from './externalTabs.store';

export class ExternalTabsService {
	constructor(private store: ExternalTabsStore) {}

	public registerTabs(name: string, options: ExternalTabOptions): void {
		const entity: ExternalTabModel = {
			name,
			label: options.label,
			module: options.module,
			component: options.component,
			containerId: options.containerId,
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

export const externalTabsService = new ExternalTabsService(externalTabsStore);
