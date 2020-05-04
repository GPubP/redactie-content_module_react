import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps, LoadingState } from '../../content.types';
import { useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { OrderBy, SearchParams } from '../../services/api';
import { ContentsSchema, DEFAULT_CONTENT_SEARCH_PARAMS, getContent } from '../../services/content';

import { CONTENT_OVERVIEW_COLUMNS } from './ContentOverview.const';
import { ContentOverviewTableRow } from './ContentOverview.types';
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
	const [t] = useCoreTranslation();

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
				<PaginatedTable
					className="u-margin-top"
					columns={CONTENT_OVERVIEW_COLUMNS(t)}
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
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
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
