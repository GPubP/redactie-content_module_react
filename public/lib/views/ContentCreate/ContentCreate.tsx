import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, useContext, useEffect, useMemo } from 'react';

import { DataLoader, RenderChildRoutes } from '../../components';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { TenantContext } from '../../context';
import { getInitialContentValues } from '../../helpers';
import { useContentItem, useContentType, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { ContentCreateSchema, ContentSchema, ContentStatus } from '../../services/content';
import { contentFacade } from '../../store/content/content.facade';
import { contentTypesFacade } from '../../store/contentTypes';

import { ContentCreateMatchProps } from './ContentCreate.types';

const ContentCreate: FC<ContentRouteProps<ContentCreateMatchProps>> = ({ match, route }) => {
	const { contentTypeId, siteId } = match.params;

	/**
	 * Hooks
	 */
	const { generatePath, navigate } = useNavigate();
	const [contentTypesLoading, contentType] = useContentType();
	const [, , contentItemDraft] = useContentItem();
	const { tenantId } = useContext(TenantContext);
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content',
			target: '',
		},
		{
			name: 'Content aanmaken',
			target: generatePath(MODULE_PATHS.createOverview, {
				siteId,
			}),
		},
	]);
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

	useEffect(() => {
		if (!contentType) {
			return;
		}

		const defaultValue: ContentSchema = {
			fields: getInitialContentValues(contentType),
			modulesData: {},
			meta: {
				label: '',
				slug: {
					nl: '',
				},
				contentType: contentType,
				status: ContentStatus.DRAFT,
				site: siteId,
			},
		};

		contentFacade.setContentItemDraft(defaultValue);
	}, [contentType]); // eslint-disable-line

	useEffect(() => {
		if (siteId && contentTypeId) {
			contentTypesFacade.getContentType(siteId, contentTypeId);
		}
	}, [siteId, contentTypeId]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.overview, { siteId });
	};

	const onSubmit = (content: ContentSchema): void => {
		if (!contentType || !content) {
			return;
		}

		const request: ContentCreateSchema = {
			meta: {
				label: content.meta?.label,
				slug: content.meta?.slug,
				contentType: contentType._id,
				status: content.meta.status as ContentStatus,
				site: siteId,
			},
			modulesData: content.modulesData,
			fields: content.fields,
		};

		contentFacade.createContentItem(siteId, request).then(response => {
			if (response) {
				navigate(`${MODULE_PATHS.detailEdit}/default`, {
					siteId,
					contentId: response.uuid,
				});
			}
		});
	};

	/**
	 * Render
	 */

	const renderChildRoutes = (): any => {
		if (!contentType) {
			return;
		}

		const extraOptions = {
			contentType,
			contentItemDraft,
			onCancel: navigateToOverview,
			onSubmit,
		};

		return (
			<div className="u-margin-top">
				<RenderChildRoutes
					routes={route.routes}
					guardsMeta={guardsMeta}
					extraOptions={extraOptions}
				/>
			</div>
		);
	};

	const contentTypeLabel = contentType?.meta.label;
	const headerTitle = contentTypeLabel ? `${contentTypeLabel} Aanmaken` : '';
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
			<ContextHeader title={headerTitle} badges={badges}>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={contentTypesLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentCreate;
