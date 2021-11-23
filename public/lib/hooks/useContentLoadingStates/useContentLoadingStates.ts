import { LoadingState, useObservable } from '@redactie/utils';

import { contentFacade } from '../../store/content';

const useContentLoadingStates = (): [LoadingState, LoadingState, LoadingState, LoadingState] => {
	const isCreating = useObservable(contentFacade.isCreating$, LoadingState.Loaded);
	const isFetching = useObservable(contentFacade.isFetching$, LoadingState.Loaded);
	const isUpdating = useObservable(contentFacade.isUpdating$, LoadingState.Loaded);
	const isPublishing = useObservable(contentFacade.isPublishing$, LoadingState.Loaded);

	return [isFetching, isCreating, isUpdating, isPublishing];
};

export default useContentLoadingStates;
