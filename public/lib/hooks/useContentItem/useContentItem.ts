import { useEffect, useState } from 'react';

import { LoadingState } from '../../content.types';
import { ContentSchema, getContentItem } from '../../services/content';

const useContentItem = (contentItemId: string): [LoadingState, ContentSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contenItem, setContentItem] = useState<ContentSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getContentItem(contentItemId)
			.then(result => {
				if (result) {
					setContentItem(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [contentItemId]);

	return [loadingState, contenItem];
};

export default useContentItem;
