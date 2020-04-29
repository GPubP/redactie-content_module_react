import { useEffect, useState } from 'react';

import { LoadingState } from '../../content.types';
import { SearchParams } from '../../services/api';
import {
	ContentTypesSchema,
	DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
	getFilteredContentTypes,
} from '../../services/contentTypes';

const useContentTypes = (
	searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
): [LoadingState, ContentTypesSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypesSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getFilteredContentTypes(searchParams)
			.then(result => {
				if (result) {
					setContentTypes(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [searchParams]);

	return [loadingState, contentTypes];
};

export default useContentTypes;
