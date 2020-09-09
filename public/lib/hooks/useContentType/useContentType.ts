import { useObservable } from '@mindspace-io/react';
import { LoadingState } from '@redactie/utils';

import { ContentTypeModel, contentTypesFacade } from '../../store/contentTypes';

const useContentType = (): [LoadingState, ContentTypeModel | null | undefined] => {
	const [isFetching] = useObservable(contentTypesFacade.isFetchingOne$, LoadingState.Loading);
	const [contentType] = useObservable(contentTypesFacade.contentType$, null);
	const [error] = useObservable(contentTypesFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;

	return [fetchingState, contentType];
};

export default useContentType;
