import { ExternalCompartmentModel, ExternalCompartmentOptions } from './externalCompartments.model';
import { ExternalCompartmentsStore, externalCompartmentsStore } from './externalCompartments.store';

export class ExternalCompartmentsService {
	constructor(private store: ExternalCompartmentsStore) {}

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

export const externalCompartmentsService = new ExternalCompartmentsService(
	externalCompartmentsStore
);
