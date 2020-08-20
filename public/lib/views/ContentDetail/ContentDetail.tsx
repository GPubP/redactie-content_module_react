import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../components';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps, LoadingState } from '../../content.types';
import { generateDetailBadges } from '../../helpers';
import {
	useActiveTabs,
	useContentItem,
	useContentType,
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
	]);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

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
		if (siteId && contentId) {
			contentFacade.getContentItem(siteId, contentId);
		}
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
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	const contentItemLabel = contentItem?.meta.label;
	const headerTitle = contentItemLabel ? `${contentItemLabel} Bewerken` : '';
	const badges = generateDetailBadges(contentItem);

	return (
		<>
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
