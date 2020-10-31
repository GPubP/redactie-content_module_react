import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { LockModel, LocksState } from './locks.model';

@StoreConfig({ name: 'locks', idKey: 'id', resettable: true })
export class LocksStore extends BaseEntityStore<LocksState, LockModel> {
	constructor(initialState: Partial<LocksState>) {
		super(initialState);
	}
}

export const locksStore = new LocksStore({});
