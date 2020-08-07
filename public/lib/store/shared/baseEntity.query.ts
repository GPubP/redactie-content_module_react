import { isNil, QueryConfigOptions, QueryEntity } from '@datorama/akita';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { LoadingState } from '../../content.types';

import { BaseEntityState } from './baseEntity.state';
import { BaseEntityStore } from './baseEntity.store';

export class BaseEntityQuery<S extends BaseEntityState<unknown, unknown>> extends QueryEntity<S> {
	constructor(protected store: BaseEntityStore<S>, options?: QueryConfigOptions) {
		super(store, options);
	}

	protected convertBoolToLoadingState(bool: boolean): LoadingState {
		if (bool) {
			return LoadingState.Loading;
		}

		return LoadingState.Loaded;
	}

	public error$ = this.selectError().pipe(filter(error => !isNil(error), distinctUntilChanged()));
	public isFetching$ = this.select(state => state.isFetching).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isFetchingOne$ = this.select(state => state.isFetchingOne).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isCreating$ = this.select(state => state.isCreating).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isUpdating$ = this.select(state => state.isUpdating).pipe(
		map(this.convertBoolToLoadingState)
	);
}
