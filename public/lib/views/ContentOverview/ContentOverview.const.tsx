import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module/public/lib/i18next/useTranslation';
import classnames from 'classnames';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { DATE_FORMATS, MODULE_PATHS } from '../../content.const';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes';

import { ContentOverviewTableRow } from './ContentOverview.types';

export const CONTENT_TYPES_SEARCH_OPTIONS = {
	...DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
	limit: -1,
};

export const CONTENT_INITIAL_FILTER_STATE = {
	search: '',
	contentType: [],
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
		component(label: string, rowData: ContentOverviewTableRow) {
			const { viewPath } = rowData;

			return (
				<>
					<AUILink to={viewPath} component={Link}>
						{label}
					</AUILink>
					<p className="u-text-light u-margin-top-xs">
						{rowData.description || 'Geen beschrijving.'}
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
		format: (data: string) => moment(data).format(DATE_FORMATS.dateAndTime),
	},
	{
		label: 'Aanmaker',
		value: 'lastEditor',
		disableSorting: true,
		component(value: any, rowData: ContentOverviewTableRow) {
			return (
				<p>
					{rowData.lastEditor?.firstname
						? `${rowData.lastEditor?.firstname} ${rowData.lastEditor?.lastname}`
						: 'Onbekend'}
				</p>
			);
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
			return (
				<span
					className={classnames('fa fa-circle', [
						rowData.published ? 'u-text-success' : 'u-text-danger',
					])}
				/>
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
