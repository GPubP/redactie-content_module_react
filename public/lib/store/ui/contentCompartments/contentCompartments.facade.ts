import { ID } from '@datorama/akita';

import {
	ContentCompartmentModel,
	ContentCompartmentRegisterOptions,
} from './contentCompartments.model';
import { ContentCompartmentsQuery, contentCompartmentsQuery } from './contentCompartments.query';
import { contentCompartmentStore, ContentCompartmentStore } from './contentCompartments.store';

export class ContentCompartmentsFacade {
	constructor(private store: ContentCompartmentStore, private query: ContentCompartmentsQuery) {}

	public readonly all$ = this.query.all$;
	public readonly active$ = this.query.active$;

	public register(
		data: ContentCompartmentModel | ContentCompartmentModel[],
		options: ContentCompartmentRegisterOptions = {}
	): void {
		const compartments = Array.isArray(data) ? data : [data];

		if (options.replace) {
			this.clearCompartments();
		}

		compartments.forEach(compartment => this.store.add(compartment));
	}

	public clearCompartments(): void {
		this.store.reset();
	}

	public setActiveByNamOrSlug(id: ID | string): void {
		const state = this.store.getValue();
		const compartment = Object.values(state?.entities || {}).find(
			compartment => compartment.slug === id
		);

		if (compartment) {
			this.setActive(compartment.name);
			return;
		}

		return this.setActive(id);
	}

	public setActive(name: ID): void {
		this.store.setActive(name);
	}

	public setValid(name: string, isValid: boolean): void {
		this.store.update(name, { isValid });
	}
}

export const contentCompartmentsFacade = new ContentCompartmentsFacade(
	contentCompartmentStore,
	contentCompartmentsQuery
);
