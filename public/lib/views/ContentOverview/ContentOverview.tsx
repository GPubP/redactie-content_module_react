import { ContextHeader } from '@acpaas-ui/react-editorial-components';
import React, { FC } from 'react';

import { ContentRouteProps } from '../../content.types';

const ContentOverview: FC<ContentRouteProps> = ({ basePath }) => {
	return <ContextHeader title="Content overzicht" />;
};

export default ContentOverview;
