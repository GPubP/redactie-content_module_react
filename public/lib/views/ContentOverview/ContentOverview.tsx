import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import FilterForm from '../../components/FilterForm/FilterForm';
import { ONLINE_OPTIONS, STATUS_OPTIONS } from '../../components/FilterForm/FilterForm.const';
import { FilterFormState, ResetForm } from '../../components/FilterForm/FilterForm.types';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps, FilterItemSchema, LoadingState } from '../../content.types';
import { useContentTypes, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import useContent from '../../hooks/useContent/useContent';
import { OrderBy, SearchParams } from '../../services/api';
import { DEFAULT_CONTENT_SEARCH_PARAMS } from '../../services/content';
import { generateFilterFormState } from '../../services/helpers';

import { CONTENT_OVERVIEW_COLUMNS } from './ContentOverview.const';
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
	const { navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [contentSearchParams, setContentSearchParams] = useState<SearchParams>(
		DEFAULT_CONTENT_SEARCH_PARAMS
	);
	const [loadingState, contents] = useContent(contentSearchParams);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	/**
	 * Methods
	 */
	const createFilterItems = ({
		search,
		contentType,
		publishedFrom,
		publishedTo,
		status,
		online,
		author,
		theme,
	}: FilterFormState): {
		filters: FilterItemSchema[];
		contentTypeFilters: FilterItemSchema[];
	} => {
		const filters = [
			{
				label: FilterKeys.SEARCH,
				value: search,
			},
			{
				label: FilterKeys.DATE,
				value: publishedFrom && publishedTo ? `${publishedFrom} - ${publishedTo}` : '',
			},
			{
				label: FilterKeys.STATUS,
				value: STATUS_OPTIONS.find(option => option.value === status)?.label || '',
			},
			{
				label: FilterKeys.ONLINE,
				value: ONLINE_OPTIONS.find(option => option.value === online)?.label || '',
			},
			{
				label: FilterKeys.AUTHOR,
				value: author,
			},
			{
				label: FilterKeys.THEME,
				value: theme,
			},
		];

		const newContentTypeList = [
			...contentTypeList,
			...(contentType && !contentTypeList.find(item => item.label === contentType)
				? [
						{
							label: contentType,
							value:
								contentTypes?.find(ct => ct._id === contentType)?.meta.label ||
								contentType,
						},
				  ]
				: []),
		];

		setContentTypeList(newContentTypeList);

		return {
			filters: [
				...filters,
				...newContentTypeList.map((item, index) => ({
					...item,
					label: `${FilterKeys.CONTENT_TYPE}_${index}_${item.label}`,
				})),
			].filter(item => !!item.value),
			contentTypeFilters: newContentTypeList,
		};
	};

	const onSubmit = (filterFormState: FilterFormState): void => {
		const filterItems = createFilterItems(filterFormState);

		//get value array from filterItems
		const contentTypesString = filterItems.contentTypeFilters.map(item => item.label);

		setFilterItems(filterItems.filters);

		//add array to searchParams
		setContentSearchParams({
			...contentSearchParams,
			search: filterFormState.search,
			contentTypes: contentTypesString,
			publishedFrom:
				filterFormState.publishedFrom && filterFormState.publishedTo
					? moment(filterFormState.publishedFrom, 'DD/MM/YYYY').toISOString()
					: '',
			publishedTo:
				filterFormState.publishedTo && filterFormState.publishedFrom
					? moment(filterFormState.publishedTo, 'DD/MM/YYYY').toISOString()
					: '',
			status: filterFormState.status,
			creator: filterFormState.author,
			// TODO: what to do with the `online` and `offline` status??
		});
	};

	const deleteAllFilters = (resetForm: ResetForm): void => {
		const emptyFilter: [] = [];
		setFilterItems(emptyFilter);
		setContentTypeList(emptyFilter);
		setContentSearchParams(DEFAULT_CONTENT_SEARCH_PARAMS);
		resetForm();
	};

	const deleteFilter = (item: FilterItemSchema): void => {
		//delete item from filterItems
		const setFilter = filterItems?.filter(el => el.value !== item.value);
		setFilterItems(setFilter);

		// Update contentSearchParams
		const filterKey = item.label.split('_')[0];

		switch (filterKey) {
			case FilterKeys.DATE:
				setContentSearchParams({
					...contentSearchParams,
					publishedFrom: '',
					publishedTo: '',
				});
				break;
			case FilterKeys.CONTENT_TYPE: {
				const newContentTypeList = [
					...contentTypeList.filter(ct => ct.value !== item.value),
				];
				setContentTypeList(newContentTypeList);
				setContentSearchParams({
					...contentSearchParams,
					contentTypes: newContentTypeList.map(item => item.label),
				});
				break;
			}
			default:
				setContentSearchParams({
					...contentSearchParams,
					[filterKey]: '',
				});
		}
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
		if (!contents || !Array.isArray(contents?.data)) {
			return null;
		}

		const contentsRows: ContentOverviewTableRow[] = contents.data.map(content => ({
			id: content.uuid as string,
			label: content.meta?.label,
			contentType: content.meta?.contentType?.meta?.label,
			lastModified: content.meta?.lastModified,
			lastEditor: content.meta?.lastEditor,
			status: content.meta?.status,
			published: content.meta?.published,
			navigate: contentId => navigate(MODULE_PATHS.update, { contentId, siteId }),
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={generateFilterFormState()}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={filterItems}
					/>
				</div>
				<PaginatedTable
					className="u-margin-top"
					columns={CONTENT_OVERVIEW_COLUMNS}
					rows={contentsRows}
					loading={loadingState === LoadingState.Loading}
					currentPage={
						Math.ceil(contents.paging.skip / DEFAULT_CONTENT_SEARCH_PARAMS.limit) + 1
					}
					itemsPerPage={DEFAULT_CONTENT_SEARCH_PARAMS.limit}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={activeSorting}
					totalValues={contents?.paging?.total || 0}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Content overzicht">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button
						onClick={() => navigate(MODULE_PATHS.createOverview, { siteId })}
						iconLeft="plus"
					>
						Nieuwe maken
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentOverview;
