import { useObservable } from '@mindspace-io/react';
import { LoadingState } from '@redactie/utils';
import { useMemo } from 'react';

import { LockModel, locksFacade } from '../../store/locks';

const useLock = (
	contentId: string
): [LoadingState, LoadingState, LockModel | null | undefined, LockModel | null | undefined] => {
	const externalLock$ = useMemo(() => locksFacade.externalLock$(contentId), [contentId]);
	const userLock$ = useMemo(() => locksFacade.userLock$(contentId), [contentId]);

	const [isFetching] = useObservable(locksFacade.isFetchingOne$, LoadingState.Loading);
	const [isCreating] = useObservable(locksFacade.isCreating$, LoadingState.Loading);
	const [externalLock] = useObservable(externalLock$, null);
	const [userLock] = useObservable(userLock$, null);
	const [error] = useObservable(locksFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;

	return [fetchingState, isCreating, externalLock, userLock];
};

export default useLock;
