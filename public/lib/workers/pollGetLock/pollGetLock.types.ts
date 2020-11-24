import ky from 'ky';

export type KyInstance = typeof ky;
export interface LockWorkerData {
	expiresAt: string;
	tenantId: string;
	siteId: string;
	lockId: string;
	intervalFallbackTime?: number;
}
