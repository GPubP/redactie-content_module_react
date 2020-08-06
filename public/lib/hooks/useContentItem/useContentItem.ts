import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../content.types';
import { contentFacade, ContentModel } from '../../store/content';

const useContentItem = (): [LoadingState, ContentModel | undefined, ContentModel | undefined] => {
	const [isFetching] = useObservable(contentFacade.isFetchingOne$, LoadingState.Loading);
	const [contentItem] = useObservable(contentFacade.contentItem$);
	const [contentItemDraft] = useObservable(contentFacade.contentItemDraft$);
	const [error] = useObservable(contentFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;

	return [fetchingState, contentItem, contentItemDraft];
};

export default useContentItem;
