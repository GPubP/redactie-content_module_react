import { api } from '../api';

import { LOCKS_PREFIX_URL } from './locks.service.const';
import { LockResponse } from './locks.service.types';

export class LocksApiService {
	public async getLock(siteId: string, lockId: string): Promise<LockResponse> {
		return api.get(`${LOCKS_PREFIX_URL}/${siteId}/locks/${lockId}`).json();
	}

	public async createLock(siteId: string, lockId: string, type: string): Promise<LockResponse> {
		return api
			.post(`${LOCKS_PREFIX_URL}/${siteId}/locks`, {
				json: {
					id: lockId,
					type,
				},
			})
			.json();
	}
}

export const locksApiService = new LocksApiService();
