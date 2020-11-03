import ky from 'ky';

import { LockResponse } from '../../services/locks';
import { LOCKS_PREFIX_URL } from '../../services/locks/locks.service.const';
import { WorkerCtx, WorkerMessageEvent } from '../workers.types';

import { FETCH_MARIGN_IN_MS, POLL_LOCK_GET_REFRESH_TIME } from './pollGetLock.const';
import { KyInstance, LockWorkerData } from './pollGetLock.types';

const ctx = (self as unknown) as WorkerCtx;

const api: KyInstance = ky.create({
	prefixUrl: '/v1/proxy/admin/',
});

let timeout: NodeJS.Timeout;

const getLock = async ({
	tenantId,
	siteId,
	lockId,
}: LockWorkerData): Promise<LockResponse | null> => {
	const lock = (await api
		.get(`${LOCKS_PREFIX_URL}/${siteId}/locks/${lockId}`, {
			headers: {
				'x-tenant-id': tenantId,
			},
		})
		.json()
		.catch(() => null)) as Promise<LockResponse>;

	return lock;
};

ctx.onmessage = async (e: WorkerMessageEvent<LockWorkerData>): Promise<void> => {
	const { expiresAt, intervalFallbackTime = POLL_LOCK_GET_REFRESH_TIME } = e.data;
	const lockExpiresAt = new Date(expiresAt);
	const timeUntil = lockExpiresAt.getTime() - new Date().getTime() + FETCH_MARIGN_IN_MS;

	if (timeout) {
		clearTimeout(timeout);
	}

	if (timeUntil < 0) {
		// There is no lock te recheck => use interval and stop it when a lock has returned
		const interval = setInterval(async () => {
			const lock = await getLock(e.data);

			ctx.postMessage(lock);
			if (lock) {
				clearInterval(interval);
			}
		}, intervalFallbackTime);
		return;
	}

	timeout = setTimeout(async () => ctx.postMessage(await getLock(e.data)), timeUntil);
};

export default (null as unknown) as new () => Worker;
