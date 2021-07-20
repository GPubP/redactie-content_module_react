import { omit } from 'ramda';

import { ExternalActionModel, ExternalActionOptions } from './externalActions.model';
import { ExternalActionsQuery, externalActionsQuery } from './externalActions.query';
import { ExternalActionsStore, externalActionsStore } from './externalActions.store';

export class ExternalActionsFacade {
	constructor(private store: ExternalActionsStore, private query: ExternalActionsQuery) {}

	public readonly all$ = this.query.all$;

	public registerAction(name: string, options: ExternalActionOptions): void {
		const entity: ExternalActionModel = {
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

export const externalActionsFacade = new ExternalActionsFacade(
	externalActionsStore,
	externalActionsQuery
);
