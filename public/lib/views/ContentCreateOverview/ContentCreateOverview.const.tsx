import { Button } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { TranslateFunc } from '@redactie/translations-module/public/lib/i18next/useTranslation';
import React from 'react';

import { ContentCreateOverviewTableRow } from './ContentCreateOverview.types';

export const CONTENT_CREATE_OVERVIEW_COLUMNS = (t: TranslateFunc): any[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		component(value: unknown, rowData: ContentCreateOverviewTableRow) {
			const { label, description } = rowData;

			return (
				<>
					{label}
					<p>
						<small>{description}</small>
					</p>
				</>
			);
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, rowData: ContentCreateOverviewTableRow) {
			const { navigate, uuid } = rowData;

			return (
				<Button outline onClick={() => navigate(uuid)} type="primary" size="small">
					{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
				</Button>
			);
		},
	},
];
