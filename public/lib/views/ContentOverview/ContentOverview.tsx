import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import FilterForm from '../../components/FilterForm/FilterForm';
import { BREADCRUMB_OPTIONS } from '../../content.const';
import { ContentRouteProps, FilterFormState, LoadingState } from '../../content.types';
import { useRoutes } from '../../hooks';
import useContent from '../../hooks/useContent/useContent';
import './ContentOverview.scss';
import { DEFAULT_VIEWS_SEARCH_PARAMS } from '../../services/content/content.service.const';
import { FilterItemSchema } from '../../services/filterItems/filterItems.service.types';
import { generateFilterFormState } from '../../services/helpers';

const ContentOverview: FC<ContentRouteProps<{ siteId: string }>> = ({
	tenantId,
	match,
	history,
}) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const [contentSearchParams, setContentSearchParams] = useState(DEFAULT_VIEWS_SEARCH_PARAMS);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [loadingState, content] = useContent(contentSearchParams);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	/**
	 * Functions
	 */
	const onSubmit = ({ search, contentType, author, theme }: FilterFormState): void => {
		console.log(search, contentType, author, theme);
		//add item to filterItems for Taglist
		// const request = { label: name, value: name };
		// const setFilter = filterItems?.concat(request);
		// setFilterItems(setFilter);
		// //get value array from filterItems
		// const names = setFilter.map(item => {
		// 	return item['value'];
		// });
		// //add array to searchParams
		// setContentSearchParams({
		// 	...contentSearchParams,
		// 	search: names,
		// });
	};

	const deleteAllFilters = (): void => {
		//set empty array as Taglist
		const emptyFilter: [] = [];
		setFilterItems(emptyFilter);
		//delete search param from api call
		setContentSearchParams({
			page: 1,
			pagesize: 10,
		});
	};

	const deleteFilter = (item: any): void => {
		//delete item from filterItems
		const setFilter = filterItems?.filter(el => el.value !== item.value);
		setFilterItems(setFilter);
		//get value array from filterItems
		const names = setFilter.map(item => {
			return item['value'];
		});
		//add array to searchParams
		setContentSearchParams({
			...contentSearchParams,
			search: names,
		});
	};

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!content) {
			return null;
		}

		const contentsRows = content.data.map(contentItem => ({
			id: contentItem.uuid,
			title: contentItem.meta?.label,
			type: contentItem.meta?.contentType?.meta?.label,
			publication: contentItem.meta?.lastModified,
			author: contentItem.meta?.lastEditor,
			status: contentItem.meta?.status,
			online: contentItem.meta?.published,
		}));

		const contentsColumns = [
			{
				label: 'Titel',
				value: 'title',
			},
			{
				label: 'Type',
				value: 'type',
			},
			{
				label: 'Publicatiedatum',
				value: 'publication',
				format: (data: string) => moment(data).format('DD/MM/YYYYY [-] hh[u]mm'),
			},
			{
				label: 'Auteur',
				value: 'author',
			},
			{
				label: 'Status',
				value: 'status',
			},
			{
				label: 'Online',
				value: 'online',
				component(value: string, rowData: any) {
					// TODO: fix any type
					const isOnline = !!rowData['online'];
					return isOnline ? (
						<span className="a-dot__green"></span>
					) : (
						<span className="a-dot__red"></span>
					);
				},
			},
			{
				label: '',
				classList: ['u-text-right'],
				disableSorting: true,
				component(value: unknown, rowData: unknown) {
					// TODO: add types for rowData
					const { id } = rowData as any;

					return (
						<Button
							ariaLabel="Edit"
							icon="edit"
							onClick={() =>
								history.push(`/${tenantId}/sites/${siteId}/content/${id}/bewerken`)
							}
							type="primary"
							transparent
						></Button>
					);
				},
			},
		];

		return (
			<div className="u-container u-wrapper">
				<div className="u-margin-top">
					<FilterForm
						initialState={generateFilterFormState()}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={filterItems}
					/>
				</div>
				<h5 className="u-margin-bottom">Resultaat ({contentsRows.length})</h5>
				<Table rows={contentsRows} columns={contentsColumns} />
			</div>
		);
	};

	return (
		<>
			<ContextHeader title="Content overzicht">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button
						onClick={() =>
							history.push(
								`/${tenantId}/sites/${siteId}/content/content-type/46bf8fd1-895f-4d6e-84be-e26f8c5a6fcb/aanmaken`
							)
						}
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
