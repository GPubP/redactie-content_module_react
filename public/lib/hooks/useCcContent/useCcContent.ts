import { LoadingState, useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { ccContentFacade } from '../../store/ccContent/ccContent.facade';
import { ContentModel } from '../../store/content';

const useCcContent = (key: string): [LoadingState, ContentModel[]] => {
	const isFetching$ = useMemo(() => ccContentFacade.selectItemIsFetching(key), [key]);
	const content$ = useMemo(() => ccContentFacade.selectItemValue(key), [key]);
	const error$ = useMemo(() => ccContentFacade.selectItemError(key), [key]);

	const loading = useObservable(isFetching$, LoadingState.Loading);
	const content = useObservable(content$, []);
	const error = useObservable(error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, content as ContentModel[]];
};

export default useCcContent;
