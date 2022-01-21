import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import {
	DataLoader,
	LoadingState,
	OrderBy,
	parseObjToOrderBy,
	parseOrderByToObj,
	SearchParams,
	useAPIQueryParams,
	useNavigate,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { useContentTypes, useRoutesBreadcrumbs } from '../../hooks';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes';
import { contentTypesFacade } from '../../store/contentTypes';

import {
	CONTENT_CREATE_OVERVIEW_COLUMNS,
	CREATE_OVERVIEW_QUERY_PARAMS_CONFIG,
} from './ContentCreateOverview.const';
import { ContentCreateOverviewTableRow } from './ContentCreateOverview.types';

const ContentCreateOverview: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */

	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content overzicht',
			target: generatePath(`${MODULE_PATHS.overview}`, { siteId }),
		},
	]);
	const [query, setQuery] = useAPIQueryParams(CREATE_OVERVIEW_QUERY_PARAMS_CONFIG, false);
	const [loadingState, contentTypes, meta] = useContentTypes();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	useEffect(() => {
		if (query && siteId) {
			contentTypesFacade.getSiteContentTypes(siteId, query as SearchParams);
		}
	}, [query, siteId]);

	/**
	 * Methods
	 */

	const handlePageChange = (page: number): void => {
		setQuery({
			skip: (page - 1) * DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery(
			parseOrderByToObj({
				...orderBy,
				key: `meta.canBeFiltered`,
			})
		);
	};

	const activeSorting = parseObjToOrderBy({
		sort: query.sort ? query.sort.split('.')[1] : '',
		direction: query.direction ?? 1,
	});

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
			type: contentType.meta.canBeFiltered ? 'Pagina' : 'Blok',
			navigate: contentTypeId => navigate(MODULE_PATHS.create, { contentTypeId, siteId }),
		}));

		return (
			<PaginatedTable
				fixed
				className="u-margin-top"
				tableClassName="a-table--fixed--xs"
				columns={CONTENT_CREATE_OVERVIEW_COLUMNS(t)}
				rows={contentTypesRows}
				currentPage={
					DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit !== -1
						? Math.ceil(meta.skip / DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit) + 1
						: 1
				}
				itemsPerPage={
					DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit !== -1
						? DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit
						: contentTypesRows.length
				}
				onPageChange={handlePageChange}
				orderBy={handleOrderBy}
				activeSorting={activeSorting}
				totalValues={meta.total || 0}
				loading={loadingState === LoadingState.Loading}
				loadDataMessage="Content types ophalen"
				noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
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
