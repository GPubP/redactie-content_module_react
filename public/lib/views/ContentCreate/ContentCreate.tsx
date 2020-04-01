import React, { FC } from 'react';

import { ContentRouteProps } from '../../content.types';
import { useContentTypes } from '../../hooks';

import { ContentCreateMatchProps } from './ContentCreate.types';

const ContentCreate: FC<ContentRouteProps<ContentCreateMatchProps>> = ({ match, tenantId }) => {
	const { siteId, contentTypeId } = match.params;

	/**
	 * Hooks
	 */
	const [contentTypesLoading, contentTypes] = useContentTypes(contentTypeId);

	console.log(contentTypesLoading, contentTypes);

	return <div>Content create route</div>;
};

export default ContentCreate;
