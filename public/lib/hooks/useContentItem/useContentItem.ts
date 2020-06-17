import { useEffect, useState } from 'react';

import { LoadingState } from '../../content.types';
import { ContentSchema, getContentItem } from '../../services/content';

const useContentItem = (
	siteId: string,
	contentItemId: string
): [LoadingState, ContentSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contenItem, setContentItem] = useState<ContentSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getContentItem(siteId, contentItemId)
			.then(result => {
				if (result) {
					setContentItem(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [contentItemId, siteId]);

	return [loadingState, contenItem];
};

export default useContentItem;
