import React, { FC } from 'react';

import { ContentRouteProps } from '../../content.types';

const ContentCreate: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	return <div>Content create route</div>;
};

export default ContentCreate;
