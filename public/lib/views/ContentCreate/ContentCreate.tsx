import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	ContextHeaderBadge,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	TenantContext,
	useDetectValueChangesWorker,
	useNavigate,
	useWillUnmount,
} from '@redactie/utils';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import rolesRightsConnector from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { getInitialContentValues, runAllSubmitHooks } from '../../helpers';
import {
	useContentItem,
	useContentType,
	useMyContentTypeRights,
	useRoutesBreadcrumbs,
} from '../../hooks';
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

	const { generatePath, navigate } = useNavigate(SITES_ROOT);
	const [contentTypeLoading, contentType] = useContentType();
	const { push } = useHistory();
	const [t] = useCoreTranslation();
	const [, , contentItemDraft] = useContentItem();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: false,
	});
	const contentTypeRights = useMyContentTypeRights(contentType?._id, mySecurityrights);
	const { tenantId } = useContext(TenantContext);
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content aanmaken',
			target: generatePath(MODULE_PATHS.createOverview, {
				siteId,
			}),
		},
	]);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const [hasChanges] = useDetectValueChangesWorker(
		!!contentItemDraft,
		contentItemDraft,
		BFF_MODULE_PUBLIC_PATH
	);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		if (
			contentTypeLoading !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [mySecurityRightsLoadingState, contentTypeLoading, contentType, mySecurityrights]);

	useWillUnmount(() => {
		contentTypesFacade.clearContentType();
	});

	useEffect(() => {
		if (contentTypeRights && !contentTypeRights.create) {
			push(
				`/${tenantId}${
					rolesRightsConnector.api.consts.forbidden403Path
				}?redirect=${generatePath(MODULE_PATHS.createOverview, {
					siteId,
				})}`
			);
		}
	}, [contentTypeRights, generatePath, push, siteId, tenantId]);

	useEffect(() => {
		if (!contentType) {
			return;
		}

		const defaultValue: ContentSchema = {
			fields: getInitialContentValues(contentType?.fields),
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
				description: content.meta?.description,
				activeLanguages: ['nl'],
				label: content.meta?.label,
				slug: content.meta?.slug,
				contentType: contentType._id,
				status: content.meta.status as ContentStatus,
				published: content.meta.status === ContentStatus.PUBLISHED,
				publishTime: content.meta?.publishTime,
				unpublishTime: content.meta?.unpublishTime,
				site: siteId,
			},
			modulesData: content.modulesData,
			fields: content.fields,
		};

		contentFacade
			.createContentItem(siteId, request)
			.then(response => {
				if (!response) {
					return;
				}

				runAllSubmitHooks(
					compartments,
					contentType,
					response,
					undefined,
					'afterSubmit'
				).then(({ hasRejected }) => {
					if (!hasRejected) {
						navigate(`${MODULE_PATHS.detailEdit}/default`, {
							siteId,
							contentId: response.uuid,
							contentTypeId,
						});
					}
				});
			})
			.catch(error => {
				// Run rollback
				runAllSubmitHooks(
					compartments,
					contentType,
					(request as unknown) as ContentSchema,
					undefined,
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
	const pageTitle = `${contentTypeLabel ? `'${contentTypeLabel}'` : 'Content'} ${t(
		CORE_TRANSLATIONS.ROUTING_CREATE
	)}`;
	const badges: ContextHeaderBadge[] = contentType
		? [
				{
					type: 'primary',
					name: contentType?.meta.canBeFiltered ? 'Pagina' : 'Blok',
				},
		  ]
		: [];

	return (
		<>
			<ContextHeader title={pageTitle} badges={badges}>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.contentCreate}
				/>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentCreate;
