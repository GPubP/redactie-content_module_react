import { useObservable } from '@mindspace-io/react';
import { LoadingState } from '@redactie/utils';
import { useMemo } from 'react';

import { ccContentFacade } from '../../store/ccContent/ccContent.facade';
import { ContentModel } from '../../store/content';

const useCcContent = (key: string): [LoadingState, ContentModel[]] => {
	const isFetching$ = useMemo(() => ccContentFacade.getIsFetching(key), [key]);
	const content$ = useMemo(() => ccContentFacade.getItemValue(key), [key]);
	const error$ = useMemo(() => ccContentFacade.getItemError(key), [key]);

	const [loading] = useObservable(isFetching$, LoadingState.Loading);
	const [content] = useObservable(content$, []);
	const [error] = useObservable(error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, content as ContentModel[]];
};

export default useCcContent;
