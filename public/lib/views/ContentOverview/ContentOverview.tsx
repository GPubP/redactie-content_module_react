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
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps, LoadingState } from '../../content.types';
import { useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { OrderBy, SearchParams } from '../../services/api';
import { ContentsSchema, getContent } from '../../services/content';

import { DEFAULT_CONTENT_SEARCH_PARAMS } from './ContentOverview.const';
import './ContentOverview.scss';

const ContentOverview: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	const { siteId } = match.params;
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contents, setContent] = useState<ContentsSchema | null>(null);
	const { navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [contentSearchParams, setContentSearchParams] = useState<SearchParams>(
		DEFAULT_CONTENT_SEARCH_PARAMS
	);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();

	useEffect(() => {
		getContent(contentSearchParams)
			.then(response => {
				if (response?.data?.length) {
					setContent(response);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [contentSearchParams]);

	/**
	 * METHODS
	 */

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

		const contentsRows = contents.data.map(content => ({
			id: content.uuid,
			label: content.meta?.label,
			contentType: content.meta?.contentType?.meta?.label,
			lastModified: content.meta?.lastModified,
			lastEditor: content.meta?.lastEditor,
			status: content.meta?.status,
			published: content.meta?.published,
		}));

		const contentsColumns = [
			{
				label: 'Titel',
				value: 'label',
			},
			{
				label: 'Type',
				value: 'contentType',
			},
			{
				label: 'Laatst bijgewerkt',
				value: 'lastModified',
				format: (data: string) => moment(data).format('DD/MM/YYYYY [-] hh[u]mm'),
			},
			{
				label: 'Auteur',
				value: 'lastEditor',
			},
			{
				label: 'Status',
				value: 'status',
			},
			{
				label: 'Online',
				value: 'published',
				component(value: string, rowData: any) {
					// TODO: fix any type
					const isOnline = !!rowData['published'];
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
							onClick={() => navigate(MODULE_PATHS.update, { contentId: id, siteId })}
							type="primary"
							transparent
						></Button>
					);
				},
			},
		];

		return (
			<>
				<PaginatedTable
					className="u-margin-top"
					columns={contentsColumns}
					rows={contentsRows}
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
				<DataLoader loadingState={loadingState} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentOverview;
