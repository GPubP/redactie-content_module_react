import { useEffect, useState } from 'react';

import { LoadingState } from '../../content.types';
import { ContentTypeSchema } from '../../services/contentTypes';
import { getContentTypes } from '../../services/contentTypes/contentTypes.service';

const useContentTypes = (): [LoadingState, ContentTypeSchema[] | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypeSchema[] | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getContentTypes()
			.then(result => {
				if (Array.isArray(result) && result.length) {
					setContentTypes(result);
				}

				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, []);

	return [loadingState, contentTypes];
};

export default useContentTypes;
