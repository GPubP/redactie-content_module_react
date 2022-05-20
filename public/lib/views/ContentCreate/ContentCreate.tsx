import {
	Container,
	ContextHeader,
	ContextHeaderLabelSection,
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
	useQuery,
	useWillUnmount,
} from '@redactie/utils';
import { Field, getSyncedTranslationValue, getTranslationSyncMappers } from '@wcm/content-mappers';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import rolesRightsConnector from '../../connectors/rolesRights';
import sitesConnector from '../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import workflowsConnector from '../../connectors/workflows';
import { MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ALERT_CONTAINER_IDS, ContentRouteProps } from '../../content.types';
import { getInitialContentValues, runAllSubmitHooks } from '../../helpers';
import {
	useContentItem,
	useContentType,
	useMyContentTypeRights,
	useRoutesBreadcrumbs,
} from '../../hooks';
import useBaseContentItem from '../../hooks/useBaseContentItem/useBaseContentItem';
import {
	ContentCreateSchema,
	ContentSchema,
	ContentStatus,
	ContentSystemNames,
} from '../../services/content';
import { contentFacade } from '../../store/content/content.facade';
import { contentTypesFacade } from '../../store/contentTypes';
import { ContentCompartmentModel } from '../../store/ui/contentCompartments';

import { ContentCreateMatchProps } from './ContentCreate.types';

const ContentCreate: FC<ContentRouteProps<ContentCreateMatchProps>> = ({ match, route }) => {
	const { contentTypeId, siteId, language } = match.params;
	const params = useQuery();

	/**
	 * Hooks
	 */

	const { generatePath, navigate } = useNavigate(SITES_ROOT);
	const [contentTypeLoading, contentType] = useContentType();
	const { push } = useHistory();
	const [t] = useCoreTranslation();
	const [, , contentItemDraft] = useContentItem();
	const [baseContentItemFetching, baseContentItem] = useBaseContentItem(
		siteId,
		params.baseContentItemId || ''
	);
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
	const workflowId = useMemo(() => {
		if (!contentType || !siteId) {
			return;
		}

		return contentType.modulesConfig?.find(
			config => config.name === 'workflow' && config.site === siteId
		)?.config.workflow;
	}, [contentType, siteId]);
	const [workflow] = workflowsConnector.hooks.useWorkflow(workflowId, siteId);
	const [site] = sitesConnector.hooks.useSite(siteId);

	useEffect(() => {
		if (
			contentTypeLoading !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading &&
			(baseContentItemFetching !== LoadingState.Loading || !params.baseContentItemId)
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [
		mySecurityRightsLoadingState,
		contentTypeLoading,
		contentType,
		mySecurityrights,
		baseContentItemFetching,
		params.baseContentItemId,
	]);

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
		if (
			!contentType ||
			(params.baseContentItemId && baseContentItemFetching !== LoadingState.Loaded)
		) {
			return;
		}

		const navTenantModulesConfig = (contentType.modulesConfig || []).find(
			moduleConfig => moduleConfig.name === 'navigation' && !moduleConfig.site
		);

		const navSiteModulesConfig = (contentType.modulesConfig || []).find(
			moduleConfig => moduleConfig.name === 'navigation' && !!moduleConfig.site
		);

		const defaultValue: ContentSchema = {
			uuid: uuidv4(),
			fields: getInitialContentValues(contentType?.fields, {}, language),
			modulesData: {},
			meta: {
				activeLanguages: [language],
				label: '',
				slug: {
					[language]: '',
				},
				lang: language,
				translationId: params.translationId || uuidv4(),
				contentType: contentType,
				status: '',
				workflowState: ContentSystemNames.NEW,
				site: siteId,
				urlPath: {
					[language]: {
						pattern:
							navSiteModulesConfig?.config?.url?.urlPattern[language] ||
							navTenantModulesConfig?.config?.url?.urlPattern[language] ||
							contentType.meta.urlPath?.pattern ||
							'',
						value: '',
						calculated: '/[item:slug]',
					},
				},
			},
		};

		if (!baseContentItem) {
			contentFacade.setContentItemDraft(defaultValue, contentType);
			return;
		}

		const mappers = getTranslationSyncMappers((contentType.fields as unknown) as Field[], {
			includeOptional: true,
		});

		// TODO: fix types
		const syncedDefaultValue = getSyncedTranslationValue(
			mappers,
			baseContentItem as any,
			defaultValue as any
		);

		contentFacade.setContentItemDraft(syncedDefaultValue as any, contentType);
	}, [contentType, baseContentItemFetching, baseContentItem]); // eslint-disable-line

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
				activeLanguages: [language],
				label: content.meta?.label,
				slug: content.meta?.slug,
				lang: content.meta?.lang,
				translationId: content.meta?.translationId,
				contentType: contentType._id,
				status: content.meta.status as ContentStatus,
				workflowState: content.meta.workflowState,
				published: content.meta.status === ContentStatus.PUBLISHED,
				publishTime: content.meta?.publishTime,
				unpublishTime: content.meta?.unpublishTime,
				site: siteId,
				urlPath: content.meta.urlPath,
			},
			modulesData: content.modulesData,
			fields: content.fields,
			uuid: content.uuid,
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
					site,
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
					site,
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
			workflow,
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
				<ContextHeaderLabelSection>
					<b>{contentItemDraft?.meta.lang.toUpperCase()}</b>
				</ContextHeaderLabelSection>
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
