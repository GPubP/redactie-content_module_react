import ky from 'ky';

export type KyInstance = typeof ky;
export interface SetLockWorkerData {
	expiresAt: string;
	tenantId: string;
	siteId: string;
	lockId: string;
	type: string;
	intervalFallbackTime?: number;
}
