import { ContentActionModel, ContentActionRegisterOptions } from './contentActions.model';
import { ContentActionsQuery, contentActionsQuery } from './contentActions.query';
import { contentActionStore, ContentActionStore } from './contentActions.store';

export class ContentActionsFacade {
	constructor(private store: ContentActionStore, private query: ContentActionsQuery) {}

	public readonly all$ = this.query.all$;

	public register(
		data: ContentActionModel | ContentActionModel[],
		options: ContentActionRegisterOptions = {}
	): void {
		const actions = Array.isArray(data) ? data : [data];

		if (options.replace) {
			this.clearActions();
		}

		actions.forEach(action => this.store.add(action));
	}

	public clearActions(): void {
		this.store.reset();
	}
}

export const contentActionsFacade = new ContentActionsFacade(
	contentActionStore,
	contentActionsQuery
);
