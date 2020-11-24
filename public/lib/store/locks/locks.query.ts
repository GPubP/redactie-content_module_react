import Core from '@redactie/redactie-core';
import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { LockModel, LocksState } from './locks.model';
import { locksStore } from './locks.store';

const parseLockAsUserLock = (lock: LockModel | null): LockModel | null => {
	if (
		!!lock?.meta?.lastEditor?.id &&
		lock.meta.lastEditor.id === Core.config.getValue('core')?.user?.id
	) {
		return lock;
	}

	return null;
};

const parseLockAsExternalLock = (lock: LockModel): LockModel | null => {
	if (
		!!lock?.meta?.lastEditor?.id &&
		lock.meta.lastEditor.id !== Core.config.getValue('core')?.user?.id
	) {
		return lock;
	}

	return null;
};

export class LocksQuery extends BaseEntityQuery<LocksState> {
	public locks$ = this.selectAll();
	public lock$ = (contentId: string): Observable<LockModel> => this.selectEntity(contentId);
	public userLock$ = (contentId: string): Observable<LockModel | null> =>
		this.selectEntity(contentId).pipe(
			map(lock => parseLockAsUserLock(lock)),
			distinctUntilChanged()
		);
	public externalLock$ = (contentId: string): Observable<LockModel | null> =>
		this.selectEntity(contentId).pipe(
			map(lock => parseLockAsExternalLock(lock)),
			distinctUntilChanged()
		);

	public getUserLock = (contentId: string): LockModel | null => {
		return parseLockAsUserLock(this.getEntity(contentId));
	};
	public getExternalLock = (contentId: string): LockModel | null => {
		return parseLockAsExternalLock(this.getEntity(contentId));
	};
}

export const locksQuery = new LocksQuery(locksStore);
