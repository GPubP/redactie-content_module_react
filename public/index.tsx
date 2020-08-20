import * as moment from 'moment';
import 'moment/locale/nl';
import React, { FC, useMemo } from 'react';

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

const ContentComponent: FC<ContentRouteProps> = ({ route, tenantId }) => {
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
		redirect: MODULE_PATHS.overview,
		routes: [
			{
				path: MODULE_PATHS.overview,
				component: ContentOverview,
				navigation: {
					context: 'site',
					label: 'Content overzicht',
					parentPath: MODULE_PATHS.root,
				},
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
				navigation: {
					context: 'site',
					label: 'Content aanmaken',
					parentPath: MODULE_PATHS.root,
					canShown: [
						rolesRightsConnector.api.canShowns.securityRightsSiteCanShown(
							urlSiteParam,
							[rolesRightsConnector.securityRights.create]
						),
					],
				},
			},
			{
				path: MODULE_PATHS.create,
				component: ContentCreate,
				redirect: `${MODULE_PATHS.create}/default`,
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
				redirect: `${MODULE_PATHS.update}/default`,
				routes: [
					{
						path: MODULE_PATHS.updateCompartment,
						component: ContentForm,
					},
				],
			},
		],
	});
} else {
	throw new Error(
		`Content Module can't resolve the following dependency: ${rolesRightsConnector.apiName}, please add the module to the dependency list.`
	);
}

registerContentAPI();

export * from './lib/api/api.types';
