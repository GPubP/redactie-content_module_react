import { FETCH_MARIGN_IN_MS } from '../workers/pollGetLock/pollGetLock.const';

export const getTimeUntilLockExpires = (
	lockExpiresAt: string | null | undefined,
	margin = FETCH_MARIGN_IN_MS
): number => {
	if (!lockExpiresAt) {
		return -1;
	}

	return new Date(lockExpiresAt).getTime() - new Date().getTime() - margin;
};
