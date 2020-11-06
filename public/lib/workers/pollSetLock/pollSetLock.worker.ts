import ky from 'ky';

import { getTimeUntilLockExpires } from '../../helpers/getTimeUntilLockExpires';
import { LockResponse } from '../../services/locks';
import { LOCKS_PREFIX_URL } from '../../services/locks/locks.service.const';
import { WorkerCtx, WorkerMessageEvent } from '../workers.types';

import { SET_MARIGN_IN_MS } from './pollSetLock.const';
import { KyInstance, SetLockWorkerData } from './pollSetLock.types';

const ctx = (self as unknown) as WorkerCtx;

const api: KyInstance = ky.create({
	prefixUrl: '/v1/proxy/admin/',
});

let timeout: NodeJS.Timeout | null;

const clearOldTimeout = (): void => {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
};

const setLock = async ({
	tenantId,
	siteId,
	lockId,
	type,
}: SetLockWorkerData): Promise<LockResponse | null> => {
	const lock = (await api
		.post(`${LOCKS_PREFIX_URL}/${siteId}/locks`, {
			json: {
				id: lockId,
				type,
			},
			headers: {
				'x-tenant-id': tenantId,
			},
		})
		.json()
		.catch(() => null)) as Promise<LockResponse | null>;

	return lock;
};

ctx.onmessage = async (e: WorkerMessageEvent<SetLockWorkerData>): Promise<void> => {
	const { expiresAt } = e.data;
	const timeUntil = getTimeUntilLockExpires(expiresAt, SET_MARIGN_IN_MS);

	// Clear older timeout since new input has been given
	clearOldTimeout();

	// Lock expireDate has been expired => create new lock immediatly
	if (timeUntil < 0) {
		ctx.postMessage(await setLock(e.data));
		return;
	}

	// create new lock x seconds before it expires (margin)
	timeout = setTimeout(async () => ctx.postMessage(await setLock(e.data)), timeUntil);
};

export default (null as unknown) as new () => Worker;
