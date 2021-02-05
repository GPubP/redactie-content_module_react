import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module/public/lib/i18next/useTranslation';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';

import { ContentCreateOverviewTableRow } from './ContentCreateOverview.types';

export const CONTENT_CREATE_OVERVIEW_COLUMNS = (t: TranslateFunc): any[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		width: '65%',
		component(value: unknown, rowData: ContentCreateOverviewTableRow) {
			const { label, description } = rowData;

			return (
				<>
					<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
					<p className="small">
						{description ? (
							<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
						) : (
							<span className="u-text-italic">
								{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
							</span>
						)}
					</p>
				</>
			);
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '35%',
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
