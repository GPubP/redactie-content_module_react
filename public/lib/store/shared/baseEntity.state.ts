import { EntityState } from '@datorama/akita';

export interface BaseEntityState<E, IDType> extends EntityState<E, IDType> {
	isFetching: boolean;
	isFetchingOne: boolean;
	isCreating: boolean;
	isUpdating: boolean;
}
