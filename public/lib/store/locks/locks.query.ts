import Core from '@redactie/redactie-core';
import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { LockModel, LocksState } from './locks.model';
import { locksStore } from './locks.store';

export class LocksQuery extends BaseEntityQuery<LocksState> {
	public locks$ = this.selectAll();
	public lock$ = (contentId: string): Observable<LockModel> => this.selectEntity(contentId);
	public userLock$ = (contentId: string): Observable<LockModel | null> =>
		this.selectEntity(contentId).pipe(
			map(lock => {
				if (
					!!lock?.meta?.lastEditor?.id &&
					lock.meta.lastEditor.id === Core.config.getValue('core')?.user?.id
				) {
					return lock;
				}

				return null;
			}),
			distinctUntilChanged()
		);
	public externalLock$ = (contentId: string): Observable<LockModel | null> =>
		this.selectEntity(contentId).pipe(
			map(lock => {
				if (
					!!lock?.meta?.lastEditor?.id &&
					lock.meta.lastEditor.id !== Core.config.getValue('core')?.user?.id
				) {
					return lock;
				}

				return null;
			}),
			distinctUntilChanged()
		);
}

export const locksQuery = new LocksQuery(locksStore);
