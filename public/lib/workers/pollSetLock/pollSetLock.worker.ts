import ky from 'ky';

import { LockResponse } from '../../services/locks';
import { LOCKS_PREFIX_URL } from '../../services/locks/locks.service.const';
import { WorkerCtx, WorkerMessageEvent } from '../workers.types';

import { FETCH_MARIGN_IN_MS } from './pollSetLock.const';
import { KyInstance, SetLockWorkerData } from './pollSetLock.types';

const ctx = (self as unknown) as WorkerCtx;

const api: KyInstance = ky.create({
	prefixUrl: '/v1/proxy/admin/',
});

let timeout: NodeJS.Timeout;

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
	const lockExpiresAt = new Date(expiresAt);
	const timeUntil = lockExpiresAt.getTime() - new Date().getTime() - FETCH_MARIGN_IN_MS;

	if (timeout) {
		clearTimeout(timeout);
	}

	if (timeUntil < 0) {
		ctx.postMessage(await setLock(e.data));
		return;
	}

	timeout = setTimeout(async () => ctx.postMessage(await setLock(e.data)), timeUntil);
};

export default (null as unknown) as new () => Worker;
