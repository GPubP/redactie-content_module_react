import { useEffect, useState } from 'react';

import { SearchParams } from '../../services/api';
import { getContent, ContentsSchema } from '../../services/content';
import { LoadingState } from '../../types';

const useContent = (searchParams: SearchParams): [LoadingState, ContentsSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [content, setContent] = useState<ContentsSchema | null>(null);

	useEffect(() => {
		getContent(searchParams)
			.then(result => {
				if (result?.data) {
					setContent(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [searchParams]);

	return [loadingState, content];
};

export default useContent;
