import { omit } from 'ramda';

import { ExternalCompartmentModel, ExternalCompartmentOptions } from './externalCompartments.model';
import { ExternalCompartmentsQuery, externalCompartmentsQuery } from './externalCompartments.query';
import { ExternalCompartmentsStore, externalCompartmentsStore } from './externalCompartments.store';

export class ExternalCompartmentsFacade {
	constructor(
		private store: ExternalCompartmentsStore,
		private query: ExternalCompartmentsQuery
	) {}

	public readonly all$ = this.query.all$;

	public registerCompartment(name: string, options: ExternalCompartmentOptions): void {
		const entity: ExternalCompartmentModel = {
			name,
			...omit(['replace'], options),
		};

		if (options.replace) {
			this.store.upsert(name, entity);
			return;
		}

		this.store.add(entity);
	}
}

export const externalCompartmentsFacade = new ExternalCompartmentsFacade(
	externalCompartmentsStore,
	externalCompartmentsQuery
);
