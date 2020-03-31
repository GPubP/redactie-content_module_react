import { Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import React, { FC } from 'react';

import { ContentRouteProps } from '../../content.types';

const ContentOverview: FC<ContentRouteProps> = ({ basePath }) => {
	return (
		<ContextHeader title="Content overzicht">
			<ContextHeaderTopSection>breadcrumbs</ContextHeaderTopSection>
			<ContextHeaderActionsSection>
				<Button iconLeft="plus">Nieuwe maken</Button>
			</ContextHeaderActionsSection>
		</ContextHeader>
	);
};

export default ContentOverview;
