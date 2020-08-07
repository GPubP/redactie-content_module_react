import { EntityStore, getEntityType, getIDType, StoreConfigOptions } from '@datorama/akita';

import { BaseEntityState } from './baseEntity.state';

export class BaseEntityStore<
	S extends BaseEntityState<any, any>,
	EntityType = getEntityType<S>,
	IDType = getIDType<S>
> extends EntityStore<S, EntityType, IDType> {
	constructor(
		initialState: Partial<S> = {
			loading: false,
			isFetchingOne: false,
			isFetching: false,
			isUpdating: false,
			isCreating: false,
		} as Partial<S>,
		options?: Partial<StoreConfigOptions>
	) {
		super(initialState, options);
	}

	public setIsFetching(isFetching = false): void {
		this.update({
			isFetching,
		} as Partial<S>);
	}

	public setIsFetchingOne(isFetchingOne = false): void {
		this.update({
			isFetchingOne,
		} as Partial<S>);
	}

	public setIsUpdating(isUpdating = false): void {
		this.update({
			isUpdating,
		} as Partial<S>);
	}

	public setIsCreating(isCreating = false): void {
		this.update({
			isCreating,
		} as Partial<S>);
	}
}
