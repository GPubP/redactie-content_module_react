import { LoadingState, useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { contentFacade, ContentModel } from '../../store/content';

const useBaseContentItem = (
	siteId: string,
	baseContentItemId: string
): [LoadingState, ContentModel | undefined, any] => {
	const isFetching = useObservable(contentFacade.baseContentItemFetching$, LoadingState.Loading);
	const [baseContentItem, setBaseContentItem] = useState<ContentModel>();
	const error = useObservable(contentFacade.error$, null);

	useEffect(() => {
		if (!baseContentItemId) {
			return;
		}

		const hasBaseContentItem = contentFacade.hasBaseContentItem(baseContentItemId);

		if (!hasBaseContentItem) {
			contentFacade.getBaseContentItem(siteId, baseContentItemId);
		}

		const baseContentItemSubscription = contentFacade.baseContentItem$.subscribe(
			setBaseContentItem
		);

		return () => {
			baseContentItemSubscription.unsubscribe();
		};
	}, [baseContentItemId, siteId]);

	const fetchingState = error ? LoadingState.Error : isFetching;

	return [fetchingState, baseContentItem, error];
};

export default useBaseContentItem;
