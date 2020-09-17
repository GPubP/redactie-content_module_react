import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { LoadingState } from '@redactie/utils';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import {
	DataLoader,
	FILTER_STATUS_OPTIONS,
	FilterForm,
	FilterFormState,
	PUBLISHED_OPTIONS,
	PublishedStatuses,
} from '../../components';
import rolesRightsConnector from '../../connectors/rolesRights';
import { useCoreTranslation } from '../../connectors/translations';
import { DATE_FORMATS, MODULE_PATHS } from '../../content.const';
import { ContentRouteProps, FilterItemSchema } from '../../content.types';
import { useContent, useContentTypes, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { OrderBy, SearchParams } from '../../services/api';
import {
	CONTENT_STATUS_TRANSLATION_MAP,
	ContentStatus,
	DEFAULT_CONTENT_SEARCH_PARAMS,
} from '../../services/content';
import { contentFacade } from '../../store/content';
import { contentTypesFacade } from '../../store/contentTypes';

import {
	CONTENT_INITIAL_FILTER_STATE,
	CONTENT_OVERVIEW_COLUMNS,
	CONTENT_TYPES_SEARCH_OPTIONS,
} from './ContentOverview.const';
import { ContentOverviewTableRow, FilterKeys } from './ContentOverview.types';

import './ContentOverview.scss';

const ContentOverview: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	const { siteId } = match.params;
	/**
	 * Hooks
	 */
	const [, contentTypes] = useContentTypes();
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const [contentTypeList, setContentTypeList] = useState<FilterItemSchema[]>([]);
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(
		CONTENT_INITIAL_FILTER_STATE
	);
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		onlyKeys: true,
	});
	const { generatePath, navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content',
			target: '',
		},
	]);
	const [contentSearchParams, setContentSearchParams] = useState<SearchParams>(
		DEFAULT_CONTENT_SEARCH_PARAMS
	);
	const [loadingState, contents, contentsPaging] = useContent();
	const [initialLoading, setInitialLoading] = useState<LoadingState>(LoadingState.Loading);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (
			loadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState, mySecurityRightsLoadingState]);

	useEffect(() => {
		if (siteId) {
			contentTypesFacade.getContentTypes(siteId, CONTENT_TYPES_SEARCH_OPTIONS);
		}
	}, [siteId]);

	useEffect(() => {
		contentFacade.getContent(siteId, contentSearchParams);
	}, [siteId, contentSearchParams]);

	/**
	 * Methods
	 */
	const createFilterItems = ({
		search,
		contentType,
		publishedFrom,
		publishedTo,
		status,
		published,
		creator,
	}: FilterFormState): {
		filters: FilterItemSchema[];
		contentTypeFilters: FilterItemSchema[];
	} => {
		const filters = [
			{
				filterKey: FilterKeys.SEARCH,
				valuePrefix: 'Zoekterm',
				value: search,
			},
			{
				filterKey: FilterKeys.DATE,
				valuePrefix: 'Gepubliceerd tussen',
				value: publishedFrom && publishedTo ? `${publishedFrom} - ${publishedTo}` : '',
			},
			{
				filterKey: FilterKeys.STATUS,
				valuePrefix: 'Status',
				value: FILTER_STATUS_OPTIONS.find(option => option.value === status)?.label || '',
			},
			{
				filterKey: FilterKeys.PUBLISHED,
				valuePrefix: 'Status',
				value: PUBLISHED_OPTIONS.find(option => option.value === published)?.label || '',
			},
			{
				filterKey: FilterKeys.CREATOR,
				valuePrefix: 'Persoon',
				value: creator,
			},
		];

		const newContentTypeList = contentType.map(ctId => ({
			valuePrefix: 'Content type',
			formvalue: ctId,
			filterKey: FilterKeys.CONTENT_TYPE,
			value: contentTypes?.find(ct => ct._id === ctId)?.meta.label || ctId,
		}));

		setContentTypeList(newContentTypeList);

		return {
			filters: [...filters, ...newContentTypeList].filter(item => !!item.value),
			contentTypeFilters: newContentTypeList,
		};
	};

	const onSubmit = (filterFormState: FilterFormState): void => {
		setFilterFormState(filterFormState);
		const filterItems = createFilterItems(filterFormState);

		// Get value array from filterItems
		const contentTypesString = filterItems.contentTypeFilters.map(item => item.formvalue);

		setFilterItems(filterItems.filters);

		// Add array to searchParams
		setContentSearchParams({
			...contentSearchParams,
			skip: 0,
			search: filterFormState.search,
			contentTypes: contentTypesString,
			published: filterFormState.published
				? filterFormState.published === PublishedStatuses.ONLINE
				: undefined,
			publishedFrom:
				filterFormState.publishedFrom && filterFormState.publishedTo
					? moment(filterFormState.publishedFrom, DATE_FORMATS.date).toISOString()
					: '',
			publishedTo:
				filterFormState.publishedTo && filterFormState.publishedFrom
					? moment(filterFormState.publishedTo, DATE_FORMATS.date).toISOString()
					: '',
			status: filterFormState.status,
			creator: filterFormState.creator,
		});
	};

	const deleteAllFilters = (): void => {
		setFilterItems([]);
		setContentTypeList([]);
		setContentSearchParams(DEFAULT_CONTENT_SEARCH_PARAMS);
		setFilterFormState(CONTENT_INITIAL_FILTER_STATE);
	};

	const deleteFilter = (item: FilterItemSchema): void => {
		let updatedSearchParams: Partial<SearchParams> = {};
		let updatedFormState: Partial<FilterFormState> = {};
		// Delete item from filterItems
		const updatedFilters = filterItems?.filter(filter => filter.value !== item.value);
		setFilterItems(updatedFilters);

		// Update contentSearchParams
		switch (item.filterKey) {
			case FilterKeys.DATE: {
				const dateValues = {
					publishedFrom: '',
					publishedTo: '',
				};
				updatedSearchParams = dateValues;
				updatedFormState = dateValues;
				break;
			}
			case FilterKeys.CONTENT_TYPE: {
				const newContentTypeList = contentTypeList.filter(ct => ct.value !== item.value);
				setContentTypeList(newContentTypeList);
				updatedSearchParams = {
					contentTypes: newContentTypeList.map(item => item.formvalue),
				};
				updatedFormState = { contentType: [] };
				break;
			}
			default:
				updatedSearchParams = { [item.filterKey]: undefined };
				updatedFormState = { [item.filterKey]: '' };
		}

		setContentSearchParams({
			...contentSearchParams,
			skip: 0,
			...updatedSearchParams,
		});
		setFilterFormState({
			...filterFormState,
			...updatedFormState,
		});
	};

	const handlePageChange = (page: number): void => {
		setContentSearchParams({
			...contentSearchParams,
			skip: (page - 1) * DEFAULT_CONTENT_SEARCH_PARAMS.limit,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setContentSearchParams({
			...contentSearchParams,
			sort: `meta.${orderBy.key}`,
			direction: orderBy.order === 'desc' ? 1 : -1,
		});
		setActiveSorting(orderBy);
	};

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
			lastModified: content.meta?.lastModified,
			lastEditor: content.meta?.lastEditor,
			status: content.meta?.status
				? CONTENT_STATUS_TRANSLATION_MAP[content.meta?.status as ContentStatus]
				: '',
			published: content.meta?.published,
			navigate: path => navigate(path, { contentId: content.uuid, siteId }),
			viewPath: generatePath(MODULE_PATHS.detailView, { contentId: content.uuid, siteId }),
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						siteId={siteId}
						initialState={filterFormState}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={filterItems}
					/>
				</div>
				<PaginatedTable
					className="u-margin-top"
					columns={CONTENT_OVERVIEW_COLUMNS(t)}
					rows={contentsRows}
					loading={loadingState === LoadingState.Loading}
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
						userSecurityRights={mySecurityrights}
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
