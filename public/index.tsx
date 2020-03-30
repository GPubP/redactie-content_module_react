import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { ContentOverview } from './lib/views';

const ContentComponent: FC<{ route: ModuleRouteConfig }> = ({ route }) => {
	const location = useLocation();

	// if path is /content, redirect to /content/overzicht
	if (/\/content$/.test(location.pathname)) {
		return <Redirect to={`${location.pathname}/overzicht`} />;
	}

	return <>{Core.routes.render(route.routes as ModuleRouteConfig[], { basePath: route.path })}</>;
};

// TODO: Find out why a timeout is needed
// All dependencies are loaded before this one
setTimeout(() => {
	const sitesAPI = Core.modules.getModuleAPI('sites-module');

	if (sitesAPI) {
		sitesAPI.routes.register({
			path: '/:siteId/content',
			component: ContentComponent,
			exact: true,
			routes: [
				{
					path: '/:siteId/content/overzicht',
					label: 'content overzicht',
					component: ContentOverview,
				},
			],
		});
	}
}, 100);
