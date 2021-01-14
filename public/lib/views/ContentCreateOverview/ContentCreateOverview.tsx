import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { LoadingState, OrderBy } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { useContentTypes, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes';
import { contentTypesFacade } from '../../store/contentTypes';

import { CONTENT_CREATE_OVERVIEW_COLUMNS } from './ContentCreateOverview.const';
import { ContentCreateOverviewTableRow } from './ContentCreateOverview.types';

const ContentCreateOverview: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	const { siteId } = match.params;
	/**
	 * Hooks
	 */
	const { navigate, generatePath } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content Overzicht',
			target: generatePath(`${MODULE_PATHS.overview}`, { siteId }),
		},
	]);
	const [contentTypesSearchParams, setContentTypesSearchParams] = useState(
		DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	);
	const [loadingState, contentTypes, meta] = useContentTypes();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	useEffect(() => {
		if (contentTypesSearchParams && siteId) {
			contentTypesFacade.getContentTypes(siteId, contentTypesSearchParams);
		}
	}, [contentTypesSearchParams, siteId]);

	/**
	 * Handlers
	 */
	const handlePageChange = (page: number): void => {
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			skip: (page - 1) * DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
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
		if (!contentTypes || !meta) {
			return null;
		}

		const contentTypesRows: ContentCreateOverviewTableRow[] = contentTypes.map(contentType => ({
			uuid: contentType.uuid,
			label: contentType.meta.label,
			description: contentType.meta.description,
			navigate: contentTypeId => navigate(MODULE_PATHS.create, { contentTypeId, siteId }),
		}));

		return (
			<PaginatedTable
				className="u-margin-top"
				columns={CONTENT_CREATE_OVERVIEW_COLUMNS(t)}
				rows={contentTypesRows}
				currentPage={Math.ceil(meta.skip / DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit) + 1}
				itemsPerPage={DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit}
				onPageChange={handlePageChange}
				orderBy={handleOrderBy}
				activeSorting={activeSorting}
				responsive={false}
				totalValues={meta.total || 0}
				loading={loadingState === LoadingState.Loading}
				hideResultsMessage
			/>
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
