import { useObservable } from '@mindspace-io/react';
import { LoadingState } from '@redactie/utils';

import { ContentTypePaging } from '../../services/contentTypes';
import { ContentTypeModel, contentTypesFacade } from '../../store/contentTypes';

const useContentTypes = (): [
	LoadingState,
	ContentTypeModel[],
	ContentTypePaging | null | undefined
] => {
	const [loading] = useObservable(contentTypesFacade.isFetching$, LoadingState.Loading);
	const [contentTypes] = useObservable(contentTypesFacade.contentTypes$, []);
	const [meta] = useObservable(contentTypesFacade.meta$, null);
	const [error] = useObservable(contentTypesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, contentTypes, meta];
};

export default useContentTypes;
