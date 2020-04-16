import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import * as moment from 'moment';
import 'moment/locale/nl';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { registerContentAPI } from './lib/api/index';
import { registerRoutes } from './lib/connectors/sites';
import { ContentRouteProps } from './lib/content.types';
import { ContentCreate, ContentOverview, ContentUpdate } from './lib/views';

// eslint-disable-next-line import/namespace
moment.locale('nl');

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

registerRoutes({
	path: '/:siteId/content',
	component: ContentComponent,
	breadcrumb: 'Content',
	exact: true,
	navigation: {
		renderContext: 'site',
		context: 'site',
		label: 'Content',
	},
	routes: [
		{
			path: '/:siteId/content/overzicht',
			component: ContentOverview,
			navigation: {
				context: 'site',
				label: 'Content overzicht',
				parentPath: '/:siteId/content',
			},
		},
		{
			path: '/:siteId/content/content-type/:contentTypeId/aanmaken',
			component: ContentCreate,
		},
		{
			path: '/:siteId/content/:contentId/bewerken',
			component: ContentUpdate,
		},
	],
});

registerContentAPI();

export * from './lib/api/api.types';
