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
			label: options.label,
			module: options.module,
			show: options.show,
			component: options.component,
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
