import { useObservable } from '@mindspace-io/react';
import { LoadingState } from '@redactie/utils';

import { contentFacade, ContentModel } from '../../store/content';

const useContentItem = (): [
	LoadingState,
	ContentModel | undefined,
	ContentModel | undefined,
	any
] => {
	const [isFetching] = useObservable(contentFacade.isFetchingOne$, LoadingState.Loading);
	const [contentItem] = useObservable(contentFacade.contentItem$);
	const [contentItemDraft] = useObservable(contentFacade.contentItemDraft$);
	const [error] = useObservable(contentFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;

	return [fetchingState, contentItem, contentItemDraft, error];
};

export default useContentItem;
