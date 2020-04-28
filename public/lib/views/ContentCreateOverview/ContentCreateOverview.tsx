import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps, LoadingState } from '../../content.types';
import { useFilteredContentTypes, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes';

import { CONTENT_CREATE_OVERVIEW_COLUMNS } from './ContentCreateOverview.const';
import { ContentCreateOverviewTableRow, OrderBy } from './ContentCreateOverview.types';

const ContentCreateOverview: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	const { siteId } = match.params;
	/**
	 * Hooks
	 */
	const breadcrumbs = useRoutesBreadcrumbs();
	const { navigate } = useNavigate();
	const [contentTypesSearchParams, setContentTypesSearchParams] = useState(
		DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	);
	const [loadingState, contentTypes] = useFilteredContentTypes(contentTypesSearchParams);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	/**
	 * Handlers
	 */
	const handlePageChange = (page: number): void => {
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			skip: (page - 1) * DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit,
		});
	};

	const handleOrderBy = (orderBy: { key: string; order: string }): void => {
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			sort: `meta.${orderBy.key}`,
			direction: orderBy.order === 'desc' ? 1 : -1,
		});
		setActiveSorting(orderBy);
	};

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!contentTypes?.data) {
			return null;
		}

		const contentTypesRows: ContentCreateOverviewTableRow[] = contentTypes.data.map(
			contentType => ({
				uuid: contentType.uuid,
				label: contentType.meta.label,
				description: contentType.meta.description,
				navigate: contentTypeId => navigate(MODULE_PATHS.create, { contentTypeId, siteId }),
			})
		);

		return (
			<PaginatedTable
				className="u-margin-top"
				columns={CONTENT_CREATE_OVERVIEW_COLUMNS}
				rows={contentTypesRows}
				currentPage={
					Math.ceil(
						contentTypes.paging.skip / DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit
					) + 1
				}
				itemsPerPage={DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit}
				onPageChange={handlePageChange}
				orderBy={handleOrderBy}
				activeSorting={activeSorting}
				totalValues={contentTypes?.paging?.total || 0}
				loading={loadingState === LoadingState.Loading}
			></PaginatedTable>
		);
	};

	return (
		<>
			<ContextHeader title="Content aanmaken">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentCreateOverview;
