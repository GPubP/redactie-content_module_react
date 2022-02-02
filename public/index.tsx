// import { akitaDevtools } from '@datorama/akita';
import { RenderChildRoutes, SiteContext, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { registerContentAPI } from './lib/api/index';
import { registerCCViews } from './lib/components/CCViews';
import { registerCCFields } from './lib/components/Fields/index';
import rolesRightsConnector from './lib/connectors/rolesRights';
import sitesConnector from './lib/connectors/sites';
import { MODULE_PATHS, urlSiteParam } from './lib/content.const';
import { ContentRouteProps } from './lib/content.types';
import {
	ContentCreate,
	ContentCreateOverview,
	ContentDetail,
	ContentDetailEdit,
	ContentDetailView,
	ContentOverview,
} from './lib/views';
import { ContentDetailExternal } from './lib/views/ContentDetailExternal';
import ContentForm from './lib/views/ContentForm/ContentForm';

// akitaDevtools();

const ContentComponent: FC<ContentRouteProps<{ siteId: string }>> = ({
	route,
	tenantId,
	match,
}) => {
	const { siteId } = match.params;
	const guardsMeta = useMemo(
		() => ({
			tenantId,
			siteId,
		}),
		[siteId, tenantId]
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
			<SiteContext.Provider value={{ siteId }}>
				<RenderChildRoutes
					routes={route.routes}
					guardsMeta={guardsMeta}
					extraOptions={extraOptions}
				/>
			</SiteContext.Provider>
		</TenantContext.Provider>
	);
};

if (rolesRightsConnector.api) {
	sitesConnector.registerRoutes({
		path: MODULE_PATHS.root,
		breadcrumb: false,
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
			order: 0,
			label: 'Content',

			canShown: [
				rolesRightsConnector.api.canShowns.securityRightsSiteCanShown(
					urlSiteParam,
					// The top menu item is visible when the user has one of the following
					// permissions
					[
						rolesRightsConnector.securityRights.read,
						rolesRightsConnector.securityRights.create,
					],
					true
				),
			],
		},
		redirect: MODULE_PATHS.overview,
		routes: [
			{
				path: MODULE_PATHS.overview,
				breadcrumb: false,
				component: ContentOverview,
				navigation: {
					context: 'site',
					order: 0,
					label: 'Content overzicht',
					parentPath: MODULE_PATHS.root,
					canShown: [
						rolesRightsConnector.api.canShowns.securityRightsSiteCanShown(
							urlSiteParam,
							[rolesRightsConnector.securityRights.read]
						),
					],
				},
			},
			{
				path: MODULE_PATHS.createOverview,
				breadcrumb: false,
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
					order: 1,
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
				breadcrumb: false,
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
						breadcrumb: false,
						component: ContentForm,
					},
				],
			},
			{
				path: MODULE_PATHS.detail,
				breadcrumb: false,
				component: ContentDetail,
				hideFooter: true,
				redirect: MODULE_PATHS.detailView,
				guardOptions: {
					guards: [
						rolesRightsConnector.api.guards.securityRightsSiteGuard(urlSiteParam, [
							rolesRightsConnector.securityRights.read,
						]),
					],
				},
				routes: [
					{
						path: MODULE_PATHS.detailView,
						breadcrumb: false,
						component: ContentDetailView,
					},
					{
						path: MODULE_PATHS.detailEdit,
						breadcrumb: false,
						component: ContentDetailEdit,
						redirect: `${MODULE_PATHS.detailEdit}/default`,
						guardOptions: {
							guards: [
								rolesRightsConnector.api.guards.securityRightsSiteGuard(
									urlSiteParam,
									[rolesRightsConnector.securityRights.update]
								),
							],
						},
						routes: [
							{
								path: MODULE_PATHS.detailEditCompartment,
								breadcrumb: false,
								component: ContentForm,
							},
						],
					},
					{
						path: MODULE_PATHS.detailExternalChild,
						breadcrumb: false,
						component: ContentDetailExternal,
						guardOptions: {
							guards: [
								rolesRightsConnector.api.guards.securityRightsSiteGuard(
									urlSiteParam,
									[rolesRightsConnector.securityRights.update]
								),
							],
						},
					},
					{
						path: MODULE_PATHS.detailExternal,
						breadcrumb: false,
						component: ContentDetailExternal,
						guardOptions: {
							guards: [
								rolesRightsConnector.api.guards.securityRightsSiteGuard(
									urlSiteParam,
									[rolesRightsConnector.securityRights.update]
								),
							],
						},
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

registerCCViews();
registerContentAPI();
registerCCFields();

export * from './lib/api/api.types';
