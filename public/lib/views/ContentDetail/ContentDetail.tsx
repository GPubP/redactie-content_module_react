import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import {
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
import { MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { generateDetailBadges } from '../../helpers';
import {
	useActiveTabs,
	useContentItem,
	useContentType,
	useLock,
	useMyContentTypeRights,
	useRoutesBreadcrumbs,
} from '../../hooks';
import { contentFacade } from '../../store/content';
import { contentTypesFacade } from '../../store/contentTypes';

import { CONTENT_UPDATE_TAB_MAP, CONTENT_UPDATE_TABS } from './ContentDetail.const';
import { ContentDetailMatchProps } from './ContentDetail.types';

import './ContentDetail.scss';

const ContentDetail: FC<ContentRouteProps<ContentDetailMatchProps>> = ({
	match,
	location,
	route,
	tenantId,
}) => {
	const { siteId, contentId } = match.params;

	/**
	 * Hooks
	 */
	const { generatePath } = useNavigate(SITES_ROOT);
	const [t] = useCoreTranslation();
	const { push } = useHistory();
	const [contentItemLoading, contentItem, contentItemDraft, contentItemError] = useContentItem();
	const [contentTypeLoading, contentType] = useContentType();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: false,
	});
	const contentTypeRights = useMyContentTypeRights(contentType?._id, mySecurityrights);
	const activeTabs = useActiveTabs(CONTENT_UPDATE_TABS, location.pathname);
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content Overzicht',
			target: generatePath(`${MODULE_PATHS.overview}`, { siteId }),
		},
	]);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [, , externalLock] = useLock(contentId);

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

	const canUpdate = useMemo(() => {
		return (
			!!contentTypeRights?.update &&
			rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrightKeys, [
				rolesRightsConnector.securityRights.update,
			])
		);
	}, [mySecurityrightKeys, contentTypeRights]);

	useWillUnmount(() => {
		contentFacade.clearContentItemDraft();
		contentFacade.clearContentItem();
	});

	useEffect(() => {
		if (
			contentTypeLoading !== LoadingState.Loading &&
			contentItemLoading !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading &&
			contentType &&
			contentItem
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [
		contentTypeLoading,
		contentItemLoading,
		contentType,
		contentItem,
		mySecurityRightsLoadingState,
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
		if (contentItem?.meta.contentType.uuid && siteId) {
			contentTypesFacade.getContentType(siteId, contentItem?.meta.contentType.uuid);
		}
	}, [siteId, contentItem]);

	useEffect(() => {
		if (!siteId || !contentId) {
			return;
		}

		contentFacade.getContentItem(siteId, contentId);
	}, [siteId, contentId]);

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
	const pageTitle = (
		<>
			<i>{contentItemLabel ?? 'Content'}</i> {t(CORE_TRANSLATIONS.ROUTING_UPDATE)}
		</>
	);
	const badges = generateDetailBadges(contentItem);

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
						}),
						component: Link,
					})}
					badges={badges}
				>
					<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				</ContextHeader>
				<Container>{renderChildRoutes()}</Container>
			</>
		);
	};

	return <DataLoader loadingState={initialLoading} render={render} />;
};

export default ContentDetail;
