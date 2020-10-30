import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer, useDetectValueChanges } from '@redactie/utils';
import React, { FC, useContext, useEffect, useMemo } from 'react';

import { DataLoader, RenderChildRoutes } from '../../components';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { TenantContext } from '../../context';
import { getInitialContentValues, runAllSubmitHooks } from '../../helpers';
import { useContentItem, useContentType, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { ContentCreateSchema, ContentSchema, ContentStatus } from '../../services/content';
import { contentFacade } from '../../store/content/content.facade';
import { contentTypesFacade } from '../../store/contentTypes';
import { ContentCompartmentModel } from '../../store/ui/contentCompartments';

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
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const [hasChanges] = useDetectValueChanges(!!contentItemDraft, contentItemDraft);

	useEffect(() => {
		if (!contentType) {
			return;
		}

		const defaultValue: ContentSchema = {
			fields: getInitialContentValues(contentType),
			modulesData: {},
			meta: {
				activeLanguages: ['nl'],
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

	const onSubmit = (
		content: ContentSchema,
		activeCompartment: ContentCompartmentModel,
		compartments: ContentCompartmentModel[]
	): void => {
		if (!contentType || !content) {
			return;
		}

		const request: ContentCreateSchema = {
			meta: {
				activeLanguages: ['nl'],
				label: content.meta?.label,
				slug: content.meta?.slug,
				contentType: contentType._id,
				status: content.meta.status as ContentStatus,
				published: content.meta.status === ContentStatus.PUBLISHED,
				site: siteId,
			},
			modulesData: content.modulesData,
			fields: content.fields,
		};

		contentFacade
			.createContentItem(siteId, request)
			.then(response => {
				if (response) {
					runAllSubmitHooks(
						activeCompartment,
						compartments,
						contentType,
						response,
						true,
						'afterSubmit'
					).then(({ hasRejected }) => {
						if (!hasRejected) {
							navigate(`${MODULE_PATHS.detailEdit}/default`, {
								siteId,
								contentId: response.uuid,
							});
						}
					});
				}
			})
			.catch(error => {
				// Run rollback
				runAllSubmitHooks(
					activeCompartment,
					compartments,
					contentType,
					(request as unknown) as ContentSchema,
					true,
					'afterSubmit',
					error
				);
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
			hasChanges,
			isCreating: true,
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
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.contentCreate} />
				</div>
				<DataLoader loadingState={contentTypesLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentCreate;
