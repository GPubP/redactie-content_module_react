import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../content.types';
import { ccContentFacade } from '../../store/ccContent/ccContent.facade';
import { ContentModel } from '../../store/content';

const useCcContent = (): [LoadingState, ContentModel[]] => {
	const [loading] = useObservable(ccContentFacade.isFetching$, LoadingState.Loading);
	const [content] = useObservable(ccContentFacade.content$, []);
	const [error] = useObservable(ccContentFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, content];
};

export default useCcContent;
