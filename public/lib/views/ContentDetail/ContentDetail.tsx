import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useWillUnmount,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { LockMessage } from '../../components';
import rolesRightsConnector from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import workflowsConnector from '../../connectors/workflows';
import { MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ALERT_CONTAINER_IDS, ContentRouteProps } from '../../content.types';
import { generateDetailBadges } from '../../helpers';
import {
	useActiveTabs,
	useContentItem,
	useContentType,
	useLock,
	useMyContentTypeRights,
	useRoutesBreadcrumbs,
} from '../../hooks';
import { useExternalTabsFacade } from '../../store/api/externalTabs';
import { contentFacade } from '../../store/content';
import { contentTypesFacade } from '../../store/contentTypes';
import { useWorkflowState } from '../../hooks/useWorkflowState';

import { CONTENT_UPDATE_TAB_MAP, CONTENT_UPDATE_TABS } from './ContentDetail.const';
import { ContentDetailMatchProps } from './ContentDetail.types';

import './ContentDetail.scss';

const ContentDetail: FC<ContentRouteProps<ContentDetailMatchProps>> = ({
	match,
	location,
	route,
	tenantId,
}) => {
	const { siteId, contentId, contentTypeId } = match.params;

	/**
	 * Hooks
	 */
	const { generatePath } = useNavigate(SITES_ROOT);
	const [t] = useCoreTranslation();
	const { push } = useHistory();
	const [contentItemLoading, contentItem, contentItemDraft, contentItemError] = useContentItem();
	const [contentTypeLoading, contentType] = useContentType();
	const [
		mySecurityRightsLoading,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: false,
	});
	const contentTypeRights = useMyContentTypeRights(contentType?._id, mySecurityrights);
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content Overzicht',
			target: generatePath(`${MODULE_PATHS.overview}`, { siteId }),
		},
	]);
	const [initialLoading, setInitialLoading] = useState(true);
	const [, , externalLock] = useLock(contentId);
	const [{ all: externalTabs }] = useExternalTabsFacade();
	const activeTabs = useActiveTabs(CONTENT_UPDATE_TABS, externalTabs, location.pathname);
	const workflowId = useMemo(() => {
		if (!contentType || !siteId) {
			return;
		}

		return contentType.modulesConfig?.find(
			config => config.name === 'workflow' && config.site === siteId
		)?.config.workflow;
	}, [contentType, siteId]);
	const [workflow] = workflowsConnector.hooks.useWorkflow(workflowId, siteId);
	const currentWorkflowState = useWorkflowState(contentItem, workflow);

	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

	const mySecurityrightKeys = useMemo(() => {
		if (!Array.isArray(mySecurityrights)) {
			return [];
		}
		return mySecurityrights.map(mySecurityRight => mySecurityRight.attributes.key);
	}, [mySecurityrights]);

	const [canUpdate, canDelete] = useMemo(() => {
		return [
			!!contentTypeRights?.update &&
				rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrightKeys, [
					rolesRightsConnector.securityRights.update,
				]),
			!!contentTypeRights?.delete &&
				rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrightKeys, [
					rolesRightsConnector.securityRights.remove,
				]),
		];
	}, [mySecurityrightKeys, contentTypeRights]);

	useWillUnmount(() => {
		contentFacade.clearContentItemDraft();
		contentFacade.clearContentItem();
	});

	useEffect(() => {
		if (
			initialLoading &&
			contentTypeLoading !== LoadingState.Loading &&
			contentItemLoading !== LoadingState.Loading &&
			mySecurityRightsLoading !== LoadingState.Loading &&
			contentType &&
			contentItem &&
			contentTypeRights
		) {
			setInitialLoading(false);
		}
	}, [
		contentTypeLoading,
		contentItemLoading,
		contentType,
		contentItem,
		mySecurityRightsLoading,
		initialLoading,
		contentTypeRights,
	]);

	const pageTabs = useMemo(() => {
		// filter tabs based on user security rights
		return activeTabs.filter(tab => {
			if (tab.name === CONTENT_UPDATE_TAB_MAP.edit.name) {
				return canUpdate;
			}
			return true;
		});
	}, [activeTabs, canUpdate]);

	useEffect(() => {
		// Redirect user to 403 page when we get a 403 error from
		// the server when fetching the latest content item
		if (
			contentItemError?.actionType === 'fetchingOne' &&
			contentItemError?.response?.status === 403
		) {
			contentFacade.clearError();
			push(
				`/${tenantId}${
					rolesRightsConnector.api.consts.forbidden403Path
				}?redirect=${generatePath(MODULE_PATHS.overview, {
					siteId,
				})}`
			);
		}
	}, [contentItemError, generatePath, push, siteId, tenantId]);

	useEffect(() => {
		if (!siteId || !contentId || !contentTypeId) {
			return;
		}

		contentFacade.getContentItem(siteId, contentId);
		contentTypesFacade.getContentType(siteId, contentTypeId);
	}, [siteId, contentId, contentTypeId]);

	useEffect(() => {
		if (contentItem) {
			contentFacade.setContentItemDraft(contentItem);
		}
	}, [contentItem]);

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			contentType,
			contentItem: contentItem,
			contentItemDraft,
			tenantId,
			canUpdate,
			canDelete,
			workflow,
		};

		return (
			<>
				{externalLock && <LockMessage className="u-margin-bottom" lock={externalLock} />}
				<RenderChildRoutes
					routes={route.routes}
					guardsMeta={guardsMeta}
					extraOptions={extraOptions}
				/>
			</>
		);
	};

	const contentItemLabel = contentItem?.meta.label;
	const pageTitle = `${contentItemLabel ? `'${contentItemLabel}'` : 'Content'} ${t(
		CORE_TRANSLATIONS.ROUTING_UPDATE
	)}`;
	const badges = generateDetailBadges(contentItem, contentType, currentWorkflowState?.data.name);

	const render = (): ReactElement => {
		return (
			<>
				<ContextHeader
					className="v-content-detail__header"
					title={pageTitle}
					tabs={pageTabs}
					linkProps={(props: any) => ({
						...props,
						to: generatePath(`${MODULE_PATHS.detail}/${props.href}`, {
							siteId,
							contentId,
							contentTypeId,
						}),
						component: Link,
					})}
					badges={badges}
				>
					<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				</ContextHeader>
				<Container>
					<AlertContainer
						toastClassName="u-margin-bottom"
						containerId={ALERT_CONTAINER_IDS.contentDetail}
					/>
					{renderChildRoutes()}
				</Container>
			</>
		);
	};

	return <DataLoader loadingState={initialLoading} render={render} />;
};

export default ContentDetail;
