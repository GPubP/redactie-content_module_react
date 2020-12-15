import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { LoadingState } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../components';
import { LockMessage } from '../../components/LockMessage/LockMessage';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { generateDetailBadges } from '../../helpers';
import {
	useActiveTabs,
	useContentItem,
	useContentType,
	useLock,
	useNavigate,
	useRoutesBreadcrumbs,
} from '../../hooks';
import { contentFacade } from '../../store/content';
import { contentTypesFacade } from '../../store/contentTypes';

import { CONTENT_UPDATE_TABS } from './ContentDetail.const';
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
	const { generatePath } = useNavigate();
	const activeTabs = useActiveTabs(CONTENT_UPDATE_TABS, location.pathname);
	const [contentItemLoading, contentItem, contentItemDraft] = useContentItem();
	const [contentTypeLoading, contentType] = useContentType();
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content',
			target: '',
		},
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

	useEffect(() => {
		contentFacade.clearContentItemDraft();
		contentFacade.clearContentItem();
	}, []);

	useEffect(() => {
		if (
			contentTypeLoading !== LoadingState.Loading &&
			contentItemLoading !== LoadingState.Loading &&
			contentType &&
			contentItem
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [contentTypeLoading, contentItemLoading, contentType, contentItem]);

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
	const headerTitle = contentItemLabel ? `${contentItemLabel} Bewerken` : '';
	const badges = generateDetailBadges(contentItem);

	return (
		<>
			ContentDetail
			<ContextHeader
				className="v-content-detail__header"
				title={headerTitle}
				tabs={activeTabs}
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
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentDetail;
