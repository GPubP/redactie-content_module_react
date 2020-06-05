import * as moment from 'moment';
import 'moment/locale/nl';
import React, { FC, useMemo } from 'react';
import { Redirect } from 'react-router-dom';

import { registerContentAPI } from './lib/api/index';
import { RenderChildRoutes } from './lib/components';
import rolesRightsConnector from './lib/connectors/rolesRights';
import { registerRoutes } from './lib/connectors/sites';
import { MODULE_PATHS, urlSiteParam } from './lib/content.const';
import { ContentRouteProps } from './lib/content.types';
import { TenantContext } from './lib/context';
import { ContentCreate, ContentCreateOverview, ContentOverview, ContentUpdate } from './lib/views';
import ContentForm from './lib/views/ContentForm/ContentForm';

// eslint-disable-next-line import/namespace
moment.locale('nl');

const ContentComponent: FC<ContentRouteProps> = ({ route, location, tenantId }) => {
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);
	const extraOptions = useMemo(
		() => ({
			routes: route.routes,
			tenantId,
		}),
		[tenantId, route.routes]
	);

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
		<TenantContext.Provider value={{ tenantId }}>
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		</TenantContext.Provider>
	);
};

if (rolesRightsConnector.api) {
	registerRoutes({
		path: MODULE_PATHS.root,
		component: ContentComponent,
		exact: true,
		guardOptions: {
			guards: [
				rolesRightsConnector.api.guards.securityRightsSiteGuard(urlSiteParam, [
					rolesRightsConnector.securityRights.read,
				]),
			],
		},
		navigation: {
			renderContext: 'site',
			context: 'site',
			label: 'Content',
			canShown: [
				rolesRightsConnector.api.canShowns.securityRightsSiteCanShown(urlSiteParam, [
					rolesRightsConnector.securityRights.read,
				]),
			],
		},
		routes: [
			{
				path: MODULE_PATHS.overview,
				component: ContentOverview,
			},
			{
				path: MODULE_PATHS.createOverview,
				component: ContentCreateOverview,
				guardOptions: {
					guards: [
						rolesRightsConnector.api.guards.securityRightsSiteGuard(urlSiteParam, [
							rolesRightsConnector.securityRights.create,
						]),
					],
				},
			},
			{
				path: MODULE_PATHS.create,
				component: ContentCreate,
				guardOptions: {
					guards: [
						rolesRightsConnector.api.guards.securityRightsSiteGuard(urlSiteParam, [
							rolesRightsConnector.securityRights.create,
						]),
					],
				},
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
}

registerContentAPI();

export * from './lib/api/api.types';
