import { BaseEntityFacade } from '@redactie/utils';

import { locksApiService, LocksApiService } from '../../services/locks';

import { LocksQuery, locksQuery } from './locks.query';
import { LocksStore, locksStore } from './locks.store';

export class LocksFacade extends BaseEntityFacade<LocksStore, LocksApiService, LocksQuery> {
	public readonly locks$ = this.query.locks$;
	public readonly lock$ = this.query.lock$;
	public readonly userLock$ = this.query.userLock$;
	public readonly externalLock$ = this.query.externalLock$;

	public async getLock(siteId: string, contentId: string): Promise<void> {
		// Check if active lock has already been fetched
		const lock = this.query.getEntity(contentId);

		if (lock && lock.siteId === siteId && new Date(lock.expireAt) > new Date()) {
			return;
		}

		this.store.setIsFetching(true);

		return this.service
			.getLock(siteId, contentId)
			.then(lock => {
				if (lock) {
					this.store.upsert([contentId], lock);
				}

				this.store.setIsFetching(false);
			})
			.catch(error => {
				if (error?.response?.status !== 404) {
					this.store.setError(error);
				}

				this.store.remove(contentId);
				this.store.setIsFetching(false);
			});
	}

	public setLock(siteId: string, contentId: string): void {
		// Check if active lock has already been fetched
		const lock = this.query.getEntity(contentId);

		if (lock && lock.siteId === siteId && new Date(lock.expireAt) > new Date()) {
			return;
		}

		this.store.setIsCreating(true);

		this.service
			.createLock(siteId, contentId, 'content')
			.then(lock => {
				if (lock) {
					this.store.upsert([contentId], lock);
				}

				this.store.setIsCreating(false);
			})
			.catch(async error => {
				if (error?.response?.status === 409) {
					await this.getLock(siteId, contentId);
					this.store.setIsCreating(false);
					return;
				}

				this.store.setError(error);
				this.store.setIsCreating(false);
			});
	}
}

export const locksFacade = new LocksFacade(locksStore, locksApiService, locksQuery);
