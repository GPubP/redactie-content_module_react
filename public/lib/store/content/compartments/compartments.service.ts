import { ID } from '@datorama/akita';

import { ContentCompartmentModel, ContentCompartmentRegisterOptions } from './compartments.model';
import { contentCompartmentStore, ContentCompartmentStore } from './compartments.store';

export class ContentCompartmentsService {
	constructor(private store: ContentCompartmentStore) {}

	register(
		data: ContentCompartmentModel | ContentCompartmentModel[],
		options: ContentCompartmentRegisterOptions = {}
	): void {
		const compartments = Array.isArray(data) ? data : [data];

		compartments.forEach(compartment => {
			if (!options?.replace) {
				this.store.add(compartment);
				return;
			}

			this.store.upsert(compartment.name, compartment);
		});
	}

	clearCompartments(): void {
		this.store.remove();
	}

	setActive(name: ID): void {
		this.store.setActive(name);
	}
}

export const contentCompartmentsService = new ContentCompartmentsService(contentCompartmentStore);
