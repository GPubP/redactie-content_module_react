import { Button } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { TranslateFunc } from '@redactie/translations-module/public/lib/i18next/useTranslation';
import moment from 'moment';
import React from 'react';

import { ContentOverviewTableRow } from './ContentOverview.types';

export const CONTENT_OVERVIEW_COLUMNS = (t: TranslateFunc): any[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'contentType',
	},
	{
		label: t(CORE_TRANSLATIONS['TABLE_LAST-MODIFIED']),
		value: 'lastModified',
		format: (data: string) => moment(data).format('DD/MM/YYYYY [-] hh[u]mm'),
	},
	{
		label: 'Auteur',
		value: 'lastEditor',
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'status',
	},
	{
		label: 'Online',
		value: 'published',
		component(value: unknown, rowData: ContentOverviewTableRow) {
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
		component(value: unknown, rowData: ContentOverviewTableRow) {
			const { id, navigate } = rowData;

			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(id)}
					type="primary"
					transparent
				></Button>
			);
		},
	},
];
