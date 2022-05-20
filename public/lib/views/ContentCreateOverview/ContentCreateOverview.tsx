import { Button, RadioGroup } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
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
import { Field, Formik } from 'formik';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import languagesConnector from '../../connectors/languages';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { useContentTypes, useRoutesBreadcrumbs } from '../../hooks';
import {
	ContentTypeSchema,
	DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
} from '../../services/contentTypes';
import { contentTypesFacade } from '../../store/contentTypes';

import {
	CONTENT_CREATE_OVERVIEW_COLUMNS,
	CREATE_OVERVIEW_QUERY_PARAMS_CONFIG,
	ORDER_BY_KEYMAP,
} from './ContentCreateOverview.const';
import { ContentCreateOverviewTableRow } from './ContentCreateOverview.types';

const ContentCreateOverview: FC<ContentRouteProps<{ siteId: string }>> = ({ match }) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [, languages] = languagesConnector.hooks.useActiveLanguagesForSite(siteId);
	const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
	const [selectedContentType, setSelectedContentType] = useState<ContentTypeSchema>();
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
	const [t] = translationsConnector.useCoreTranslation();

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
				key: ORDER_BY_KEYMAP[orderBy.key] || `meta.${orderBy.key}`,
			})
		);
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

	const languageOptions = useMemo(
		() =>
			(languages || []).map(language => ({
				label: `${language.name} (${language.key})`,
				value: language.key,
			})),
		[languages]
	);

	const handleSelectContentType = (contentTypeId: string): void => {
		if (languages?.length === 1) {
			return navigate(MODULE_PATHS.create, {
				contentTypeId,
				siteId,
				language: languages[0].key,
			});
		}

		setShowLanguageModal(true);
		setSelectedContentType(contentTypes.find(ct => ct.uuid === contentTypeId));
	};

	const handleLanguageSelect = ({ language }: { language: string }): void => {
		navigate(MODULE_PATHS.create, {
			contentTypeId: selectedContentType?.uuid,
			siteId,
			language,
		});
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
			type: contentType.meta.canBeFiltered ? 'Pagina' : 'Blok',
			onSelectContentType: handleSelectContentType,
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
			<Formik initialValues={{ language: '' }} onSubmit={handleLanguageSelect}>
				{({ submitForm }) => (
					<ControlledModal
						show={showLanguageModal}
						onClose={() => setShowLanguageModal(false)}
						size="large"
					>
						<ControlledModalHeader>
							<h4>{selectedContentType?.meta.label} aanmaken</h4>
						</ControlledModalHeader>
						<ControlledModalBody>
							<Field
								as={RadioGroup}
								id="language"
								name="language"
								options={languageOptions}
								label="Bepaal in welke taal je dit content item wil aanmaken."
							/>
						</ControlledModalBody>
						<ControlledModalFooter>
							<div className="u-flex u-flex-item u-flex-justify-end">
								<Button onClick={() => setShowLanguageModal(false)} negative>
									Annuleer
								</Button>
								<Button type="info" onClick={submitForm}>
									Aanmaken
								</Button>
							</div>
						</ControlledModalFooter>
					</ControlledModal>
				)}
			</Formik>
		</>
	);
};

export default ContentCreateOverview;
