import { EntityStore, getEntityType, getIDType, StoreConfigOptions } from '@datorama/akita';

import { BaseEntityState } from './baseEntity.state';

const DEFAULT_INITIAL_STATE = {
	loading: false,
	isFetchingOne: false,
	isFetching: false,
	isUpdating: false,
	isCreating: false,
};

export class BaseEntityStore<
	S extends BaseEntityState<any, any>,
	EntityType = getEntityType<S>,
	IDType = getIDType<S>
> extends EntityStore<S, EntityType, IDType> {
	constructor(
		initialState: Partial<S> = DEFAULT_INITIAL_STATE as Partial<S>,
		options?: Partial<StoreConfigOptions>
	) {
		super(
			{
				...DEFAULT_INITIAL_STATE,
				...initialState,
			},
			options
		);
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
