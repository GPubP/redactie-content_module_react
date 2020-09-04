import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { TranslateFunc } from '@redactie/translations-module/public/lib/i18next/useTranslation';
import moment from 'moment';
import { propOr } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import { MODULE_PATHS } from '../../content.const';

import { ContentOverviewTableRow } from './ContentOverview.types';

export const CONTENT_TYPES_SEARCH_OPTIONS = {
	skip: 0,
	limit: -1,
};

export const CONTENT_INITIAL_FILTER_STATE = {
	search: '',
	contentType: '',
	publishedFrom: '',
	publishedTo: '',
	status: '',
	published: '',
	creator: '',
};

export const CONTENT_OVERVIEW_COLUMNS = (t: TranslateFunc): any[] => [
	{
		label: 'Titel',
		value: 'label',
		component(value: any, rowData: ContentOverviewTableRow) {
			const { navigate } = rowData;
			return (
				<>
					<AUILink to={() => navigate(MODULE_PATHS.detailView)} component={Link}>
						{rowData.label}
					</AUILink>
					<p className="u-text-light u-margin-top-xs">
						{propOr('Geen beschrijving.', 'description')(rowData)}
					</p>
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'contentType',
		disableSorting: true,
	},
	{
		label: t(CORE_TRANSLATIONS['TABLE_LAST-MODIFIED']),
		value: 'lastModified',
		disableSorting: true,
		format: (data: string) => moment(data).format('DD/MM/YYYY [-] hh[u]mm'),
	},
	{
		label: 'Aanmaker',
		value: 'lastEditor',
		disableSorting: true,
		component(value: any, rowData: ContentOverviewTableRow) {
			return <p>{propOr('Onbekend', 'lastEditor')(rowData)}</p>;
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'status',
		disableSorting: true,
	},
	{
		label: 'Online',
		value: 'published',
		disableSorting: true,
		component(value: unknown, rowData: ContentOverviewTableRow) {
			const isOnline = rowData.published;
			return isOnline ? (
				<span className="u-text-success fa fa-circle"></span>
			) : (
				<span className="u-text-danger fa fa-circle"></span>
			);
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, rowData: ContentOverviewTableRow) {
			const { navigate } = rowData;

			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(MODULE_PATHS.detailEdit)}
					type="primary"
					transparent
				/>
			);
		},
	},
];
