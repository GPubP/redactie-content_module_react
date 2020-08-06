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
			contentItemLoading !== LoadingState.Loading
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [contentTypeLoading, contentItemLoading]);

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

	const contentTypeLabel = contentItem?.meta.label;
	const headerTitle = contentTypeLabel ? `${contentTypeLabel} Bewerken` : '';
	const badges = contentTypeLabel
		? [
				{
					name: contentTypeLabel,
					type: 'primary',
				},
		  ]
		: [];

	return (
		<>
			<ContextHeader
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
