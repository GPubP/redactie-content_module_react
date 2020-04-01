import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { ContentRouteProps } from './lib/content.types';
import { ContentCreate, ContentOverview } from './lib/views';

const ContentComponent: FC<ContentRouteProps> = ({ route, location, match, tenantId }) => {
	// if path is /content, redirect to /content/overzicht
	if (/\/content$/.test(location.pathname)) {
		return <Redirect to={`${location.pathname}/overzicht`} />;
	}

	return (
		<>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				basePath: match.url,
				tenantId,
			})}
		</>
	);
};

const sitesAPI = Core.modules.getModuleAPI('sites-module');

if (sitesAPI) {
	sitesAPI.routes.register({
		path: '/:siteId/content',
		component: ContentComponent,
		breadcrumb: 'Content',
		exact: true,
		routes: [
			{
				path: '/:siteId/content/overzicht',
				label: 'content overzicht',
				component: ContentOverview,
			},
			{
				path: '/:siteId/content/content-type/:contentTypeId/aanmaken',
				component: ContentCreate,
			},
		],
	});
}
