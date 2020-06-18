import { useEffect, useState } from 'react';

import { LoadingState } from '../../content.types';
import { SearchParams } from '../../services/api';
import { ContentsSchema, getContent } from '../../services/content';

const useContent = (
	siteId: string,
	searchParams: SearchParams
): [LoadingState, ContentsSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [content, setContent] = useState<ContentsSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getContent(siteId, searchParams)
			.then(result => {
				if (result?.data) {
					setContent(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [searchParams, siteId]);

	return [loadingState, content];
};

export default useContent;
