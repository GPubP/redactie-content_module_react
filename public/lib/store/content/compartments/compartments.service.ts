import { ID } from '@datorama/akita';

import { ContentCompartmentModel, ContentCompartmentRegisterOptions } from './compartments.model';
import { contentCompartmentStore, ContentCompartmentStore } from './compartments.store';

export class ContentCompartmentsService {
	constructor(private store: ContentCompartmentStore) {}

	public register(
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

	public clearCompartments(): void {
		this.store.reset();
	}

	public setActive(names: ID[]): void {
		this.store.setActive(names);
	}

	public addActive(names: ID | ID[]): void {
		this.store.addActive(names);
	}
}

export const contentCompartmentsService = new ContentCompartmentsService(contentCompartmentStore);
