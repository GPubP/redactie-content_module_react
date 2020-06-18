import { useEffect, useState } from 'react';

import { LoadingState } from '../../content.types';
import { ContentTypeSchema, getContentType } from '../../services/contentTypes';

const useContentType = (
	siteId: string,
	contentTypeId?: string
): [LoadingState, ContentTypeSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contenType, setContentType] = useState<ContentTypeSchema | null>(null);

	useEffect(() => {
		if (contentTypeId === undefined) {
			return;
		}

		setLoadingState(LoadingState.Loading);
		getContentType(siteId, contentTypeId)
			.then(result => {
				if (result) {
					setContentType(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [contentTypeId, siteId]);

	return [loadingState, contenType];
};

export default useContentType;
