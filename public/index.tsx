import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import * as moment from 'moment';
import 'moment/locale/nl';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { registerContentAPI } from './lib/api/index';
import { registerRoutes } from './lib/connectors/sites';
import { MODULE_PATHS } from './lib/content.const';
import { ContentRouteProps } from './lib/content.types';
import { ContentCreate, ContentOverview, ContentUpdate } from './lib/views';
import ContentForm from './lib/views/ContentForm/ContentForm';

// eslint-disable-next-line import/namespace
moment.locale('nl');

const ContentComponent: FC<ContentRouteProps> = ({ route, location, match, tenantId }) => {
	// if path is /content, redirect to /content/overzicht
	if (
		/\/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b\/content$/.test(
			location.pathname
		)
	) {
		return <Redirect to={`${location.pathname}/overzicht`} />;
	}

	if (/\/aanmaken$/.test(location.pathname)) {
		return <Redirect to={`${location.pathname}/default`} />;
	}

	if (/\/bewerken$/.test(location.pathname)) {
		return <Redirect to={`${location.pathname}/default`} />;
	}

	return (
		<>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				routes: route.routes,
				basePath: match.url,
				tenantId,
			})}
		</>
	);
};

registerRoutes({
	path: MODULE_PATHS.root,
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
			path: MODULE_PATHS.overview,
			component: ContentOverview,
			navigation: {
				context: 'site',
				label: 'Content overzicht',
				parentPath: '/:siteId/content',
			},
		},
		{
			path: MODULE_PATHS.create,
			component: ContentCreate,
			routes: [
				{
					path: MODULE_PATHS.createCompartment,
					component: ContentForm,
				},
			],
		},
		{
			path: MODULE_PATHS.update,
			component: ContentUpdate,
			routes: [
				{
					path: MODULE_PATHS.updateCompartment,
					component: ContentForm,
				},
			],
		},
	],
});

registerContentAPI();

export * from './lib/api/api.types';
