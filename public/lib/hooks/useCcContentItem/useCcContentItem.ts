import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../content.types';
import { ccContentFacade } from '../../store/ccContent/ccContent.facade';
import { ContentModel } from '../../store/content';

const useCcContentItem = (): [LoadingState, ContentModel | null | undefined] => {
	const [loading] = useObservable(ccContentFacade.isFetching$, LoadingState.Loading);
	const [contentItem] = useObservable(ccContentFacade.contentItem$, null);
	const [error] = useObservable(ccContentFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, contentItem];
};

export default useCcContentItem;
