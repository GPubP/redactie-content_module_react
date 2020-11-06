import ky from 'ky';

import { getTimeUntilLockExpires } from '../../helpers/getTimeUntilLockExpires';
import { LockResponse } from '../../services/locks';
import { LOCKS_PREFIX_URL } from '../../services/locks/locks.service.const';
import { WorkerCtx, WorkerMessageEvent } from '../workers.types';

import { FETCH_MARIGN_IN_MS, POLL_LOCK_GET_REFRESH_TIME } from './pollGetLock.const';
import { KyInstance, LockWorkerData } from './pollGetLock.types';

const ctx = (self as unknown) as WorkerCtx;

const api: KyInstance = ky.create({
	prefixUrl: '/v1/proxy/admin/',
});

let timeout: NodeJS.Timeout | null = null;
let interval: NodeJS.Timeout | null = null;

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

const clearOldTimeout = (): void => {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
};

const clearOldInterval = (): void => {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
};

ctx.onmessage = async (e: WorkerMessageEvent<LockWorkerData>): Promise<void> => {
	const { expiresAt, intervalFallbackTime = POLL_LOCK_GET_REFRESH_TIME } = e.data;
	const timeUntil = getTimeUntilLockExpires(expiresAt, FETCH_MARIGN_IN_MS);

	// Clear older timeout since new input has been given
	clearOldTimeout();

	// There is no lock te recheck => use interval and stop it when a lock has returned
	if (!expiresAt) {
		clearOldInterval();
		ctx.postMessage(await getLock(e.data));
		interval = setInterval(async () => {
			const lock = await getLock(e.data);

			ctx.postMessage(lock);
		}, intervalFallbackTime);
		return;
	}

	// There is an active lock => clear interval and set timeout
	clearOldInterval();

	// Lock expireDate has been expired => fetch new lock immediatly
	if (timeUntil < 0) {
		ctx.postMessage(await getLock(e.data));
		return;
	}

	// Fetch lock x seconds after it expires (margin)
	timeout = setTimeout(async () => ctx.postMessage(await getLock(e.data)), timeUntil);
};

export default (null as unknown) as new () => Worker;
