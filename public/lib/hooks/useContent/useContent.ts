import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../content.types';
import { PagingSchema } from '../../services/content';
import { contentFacade, ContentModel } from '../../store/content';

const useContent = (): [LoadingState, ContentModel[], PagingSchema | null | undefined] => {
	const [loading] = useObservable(contentFacade.isFetching$, LoadingState.Loading);
	const [content] = useObservable(contentFacade.content$, []);
	const [meta] = useObservable(contentFacade.meta$, null);
	const [error] = useObservable(contentFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, content, meta];
};

export default useContent;