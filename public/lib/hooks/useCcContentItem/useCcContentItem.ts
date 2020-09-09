import { useObservable } from '@mindspace-io/react';
import { LoadingState } from '@redactie/utils';
import { useMemo } from 'react';

import { ccContentFacade } from '../../store/ccContent/ccContent.facade';
import { ContentModel } from '../../store/content';

const useCcContentItem = (uuid: string): [LoadingState, ContentModel | null | undefined] => {
	const isFetching$ = useMemo(() => ccContentFacade.getIsFetching(uuid), [uuid]);
	const contentItem$ = useMemo(() => ccContentFacade.getItemValue(uuid), [uuid]);
	const error$ = useMemo(() => ccContentFacade.getItemError(uuid), [uuid]);

	const [loading] = useObservable(isFetching$, LoadingState.Loading);
	const [contentItem] = useObservable(contentItem$, null);
	const [error] = useObservable(error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, contentItem as ContentModel];
};

export default useCcContentItem;
