import { useEffect, useState } from 'react';

import { LoadingState } from '../../content.types';
import { ContentTypeSchema, getContentType } from '../../services/contentTypes';

const useContentType = (contentTypeId: string): [LoadingState, ContentTypeSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contenType, setContentType] = useState<ContentTypeSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getContentType(contentTypeId)
			.then(result => {
				if (result) {
					setContentType(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [contentTypeId]);

	return [loadingState, contenType];
};

export default useContentType;
