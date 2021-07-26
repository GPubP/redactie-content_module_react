import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	DataLoader,
	LoadingState,
	OrderBy,
	parseObjToOrderBy,
	parseOrderByToObj,
	SearchParams,
	useAPIQueryParams,
	useNavigate,
} from '@redactie/utils';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import {
	FILTER_STATUS_OPTIONS,
	FilterForm,
	FilterFormState,
	PUBLISHED_OPTIONS,
	PublishedStatuses,
} from '../../components';
import rolesRightsConnector from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { ALERT_CONTAINER_IDS, DATE_FORMATS, DEFAULT_CRUD_RIGHTS, MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ContentRouteProps, OverviewFilterItem } from '../../content.types';
import { generateActiveFilters, getFilterStateFromParams, getLatestStatus } from '../../helpers';
import {
	useContent,
	useContentTypes,
	useMyContentTypesRights,
	useRoutesBreadcrumbs,
} from '../../hooks';
import {
	CONTENT_STATUS_TRANSLATION_MAP,
	ContentExtraFilterStatus,
	ContentHistorySummary,
	DEFAULT_CONTENT_SEARCH_PARAMS,
} from '../../services/content';
import { contentFacade } from '../../store/content';
import { contentTypesFacade } from '../../store/contentTypes';

import {
	CONTENT_OVERVIEW_COLUMNS,
	CONTENT_TYPES_SEARCH_OPTIONS,
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	ORDER_BY_KEYMAP,
	OVERVIEW_QUERY_PARAMS_CONFIG,
} from './ContentOverview.const';
import { ContentOverviewTableRow, FilterKeys } from './ContentOverview.types';

import './ContentOverview.scss';

const ContentOverview: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */

	const [, contentTypes] = useContentTypes();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: false,
	});
	const mySecurityrightsKeys = useMemo(
		() => mySecurityrights.map(right => right.attributes?.key),
		[mySecurityrights]
	);
	const { generatePath, navigate } = useNavigate(SITES_ROOT);
	const breadcrumbs = useRoutesBreadcrumbs();
	const [query, setQuery] = useAPIQueryParams(OVERVIEW_QUERY_PARAMS_CONFIG, false);
	const [loadingState, contents, contentsPaging] = useContent();
	const contentTypesSecurityRightsMap = useMyContentTypesRights(contents, mySecurityrights);
	const [initialLoading, setInitialLoading] = useState<LoadingState>(LoadingState.Loading);
	const filterFormState = useMemo(() => getFilterStateFromParams(query as SearchParams), [query]);
	const activeFilters = useMemo(
		() =>
			generateActiveFilters(
				filterFormState,
				FILTER_STATUS_OPTIONS,
				PUBLISHED_OPTIONS,
				contentTypes
			),
		[contentTypes, filterFormState]
	);
	const [t] = useCoreTranslation();

	// Set initial loading state
	useEffect(() => {
		if (
			loadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState, mySecurityRightsLoadingState]);

	// Fetch content types for filtering
	useEffect(() => {
		if (siteId) {
			contentTypesFacade.getSiteContentTypes(siteId, CONTENT_TYPES_SEARCH_OPTIONS);
		}
	}, [siteId]);

	// Fetch content based on query params
	useEffect(() => {
		const getContentQuery = { ...query };

		if (query['latest-status'] === ContentExtraFilterStatus.ALL) {
			getContentQuery['latest-status'] = undefined;
		}

		if (query.published === ContentExtraFilterStatus.ALL) {
			getContentQuery.published = undefined;
		}

		contentFacade.getContent(siteId, getContentQuery as SearchParams);
	}, [siteId, query]);

	/**
	 * Methods
	 */
	const canUpdateContent = useMemo(
		() =>
			rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrightsKeys, [
				rolesRightsConnector.securityRights.update,
			]),
		[mySecurityrightsKeys]
	);

	const onSubmit = (newFormState: FilterFormState): void => {
		setQuery({
			skip: 0,
			search: newFormState.search || undefined,
			contentTypes: newFormState.contentType.length ? newFormState.contentType : undefined,
			published: newFormState.published
				? newFormState.published === ContentExtraFilterStatus.ALL
					? ContentExtraFilterStatus.ALL
					: `${newFormState.published === PublishedStatuses.ONLINE}`
				: undefined,
			publishedFrom:
				newFormState.publishedFrom && newFormState.publishedTo
					? moment(newFormState.publishedFrom, DATE_FORMATS.date).toISOString()
					: undefined,
			publishedTo:
				newFormState.publishedTo && newFormState.publishedFrom
					? moment(newFormState.publishedTo, DATE_FORMATS.date).toISOString()
					: undefined,
			['latest-status']: newFormState.status || undefined,
			creator: newFormState.creator || undefined,
		});
	};

	const deleteAllFilters = (): void => {
		setQuery(DEFAULT_OVERVIEW_QUERY_PARAMS);
	};

	const deleteFilter = (item: OverviewFilterItem): void => {
		let updatedQuery: Partial<SearchParams> = {};

		switch (item.filterKey) {
			case FilterKeys.DATE: {
				updatedQuery = {
					publishedFrom: undefined,
					publishedTo: undefined,
				};
				break;
			}
			case FilterKeys.CONTENT_TYPE: {
				const newContentTypeList = activeFilters.contentTypeFilters.filter(
					ct => ct.formvalue !== item.formvalue
				);
				updatedQuery = {
					contentTypes: newContentTypeList.length
						? newContentTypeList.map(item => item.formvalue)
						: undefined,
				};
				break;
			}
			default:
				updatedQuery = { [item.filterKey]: undefined };
		}

		setQuery({
			skip: 0,
			...updatedQuery,
		});
	};

	const handlePageChange = (page: number): void => {
		setQuery({
			skip: (page - 1) * DEFAULT_CONTENT_SEARCH_PARAMS.limit,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery({
			skip: 0,
			...parseOrderByToObj({
				...orderBy,
				key: ORDER_BY_KEYMAP[orderBy.key] || `meta.${orderBy.key}`,
			}),
		});
	};

	const getSortFromQuery = (sort: string | null | undefined): string => {
		if (!sort) {
			return '';
		}

		const findFromOrderByMap = Object.keys(ORDER_BY_KEYMAP).find(
			key => ORDER_BY_KEYMAP[key] === sort
		);

		return findFromOrderByMap || sort.split('.')[1];
	};

	const activeSorting = parseObjToOrderBy({
		sort: getSortFromQuery(query.sort),
		direction: query.direction ?? 1,
	});

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!contents || !Array.isArray(contents) || !contentsPaging) {
			return null;
		}

		const contentsRows: ContentOverviewTableRow[] = contents.map(content => ({
			label: content.meta?.label,
			contentType: content.meta?.contentType?.meta?.label,
			lastEdit: content.meta?.historySummary?.lastEdit || content.meta?.lastModified,
			lastEditor: content.meta?.lastEditor,
			status: content.meta?.historySummary
				? CONTENT_STATUS_TRANSLATION_MAP[
						getLatestStatus(content.meta.historySummary as ContentHistorySummary)
				  ]
				: '',
			published: content.meta?.published,
			description: content.meta?.description,
			navigate: path => navigate(path, { contentId: content.uuid, siteId }),
			viewPath: generatePath(MODULE_PATHS.detailView, {
				contentId: content.uuid,
				siteId,
			}),
			canUpdate:
				canUpdateContent &&
				(content._id
					? contentTypesSecurityRightsMap[content._id] || {}
					: DEFAULT_CRUD_RIGHTS
				).update,
		}));

		return (
			<>
				<AlertContainer
					toastClassName="u-margin-top"
					containerId={ALERT_CONTAINER_IDS.contentRemove}
				/>
				<div className="u-margin-top">
					<FilterForm
						siteId={siteId}
						initialState={filterFormState}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={activeFilters.filters}
					/>
				</div>
				<PaginatedTable
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--lg"
					columns={CONTENT_OVERVIEW_COLUMNS(t)}
					rows={contentsRows}
					loading={loadingState === LoadingState.Loading}
					loadDataMessage="Content ophalen"
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
					currentPage={
						Math.ceil(contentsPaging.skip / DEFAULT_CONTENT_SEARCH_PARAMS.limit) + 1
					}
					itemsPerPage={DEFAULT_CONTENT_SEARCH_PARAMS.limit}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={activeSorting}
					totalValues={contentsPaging.total || 0}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Content overzicht">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<rolesRightsConnector.api.components.SecurableRender
						userSecurityRights={mySecurityrightsKeys}
						requiredSecurityRights={[rolesRightsConnector.securityRights.create]}
					>
						<Button
							onClick={() => navigate(MODULE_PATHS.createOverview, { siteId })}
							iconLeft="plus"
						>
							{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
						</Button>
					</rolesRightsConnector.api.components.SecurableRender>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentOverview;
