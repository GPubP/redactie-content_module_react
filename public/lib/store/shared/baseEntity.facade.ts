import { BaseEntityQuery, BaseEntityStore } from '../shared';

export class BaseEntityFacade<
	S extends BaseEntityStore<any, any>,
	SE,
	Q extends BaseEntityQuery<any>
> {
	constructor(protected store: S, protected service: SE, protected query: Q) {}

	public readonly isFetching$ = this.query.isFetching$;
	public readonly isFetchingOne$ = this.query.isFetchingOne$;
	public readonly isCreating$ = this.query.isCreating$;
	public readonly isUpdating$ = this.query.isUpdating$;
	public readonly error$ = this.query.error$;
}
