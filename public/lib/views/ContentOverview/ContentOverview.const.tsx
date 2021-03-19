import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module/public/lib/i18next/useTranslation';
import { TableColumn } from '@redactie/utils';
import classnames from 'classnames';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { DATE_FORMATS, MODULE_PATHS } from '../../content.const';
import { DEFAULT_CONTENT_SEARCH_PARAMS } from '../../services/content';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes';

import { ContentOverviewTableRow } from './ContentOverview.types';

export const OVERVIEW_QUERY_PARAMS_CONFIG = {
	skip: { defaultValue: DEFAULT_CONTENT_SEARCH_PARAMS.skip, type: 'number' },
	limit: { defaultValue: DEFAULT_CONTENT_SEARCH_PARAMS.limit, type: 'number' },
	sparse: { defaultValue: DEFAULT_CONTENT_SEARCH_PARAMS.sparse, type: 'boolean' },
	sort: { type: 'string' },
	direction: { type: 'number' },
	search: { type: 'string' },
	contentTypes: { type: 'array' },
	publishedFrom: { type: 'string' },
	publishedTo: { type: 'string' },
	['latest-status']: { type: 'string' },
	published: { type: 'boolean' },
	creator: { type: 'string' },
} as const;

export const DEFAULT_OVERVIEW_QUERY_PARAMS = {
	...DEFAULT_CONTENT_SEARCH_PARAMS,
	sort: undefined,
	direction: undefined,
	search: undefined,
	contentTypes: undefined,
	publishedFrom: undefined,
	publishedTo: undefined,
	['latest-status']: undefined,
	published: undefined,
	creator: undefined,
};

export const CONTENT_TYPES_SEARCH_OPTIONS = {
	...DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
	limit: -1,
};

export const CONTENT_OVERVIEW_COLUMNS = (
	t: TranslateFunc
): TableColumn<ContentOverviewTableRow>[] => [
	{
		label: 'Titel',
		value: 'label',
		width: '27%',
		component(label: string, { viewPath, description }) {
			return (
				<>
					<AUILink to={viewPath} component={Link}>
						<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
					</AUILink>
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
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'contentType',
		ellipsis: true,
		width: '15%',
		// Temporary fix until sorting on referenced fields is supported by the backend
		disableSorting: true,
	},
	{
		label: t(CORE_TRANSLATIONS['TABLE_LAST-MODIFIED']),
		value: 'lastModified',
		width: '18%',
		format: (data: string) => moment(data).format(DATE_FORMATS.dateAndTime),
	},
	{
		label: 'Aanmaker',
		value: 'lastEditor',
		disableSorting: true,
		width: '15%',
		component(value, rowData) {
			return (
				<p>
					{rowData.lastEditor?.firstname ? (
						<EllipsisWithTooltip>
							{rowData.lastEditor?.firstname} {rowData.lastEditor?.lastname}
						</EllipsisWithTooltip>
					) : (
						'Onbekend'
					)}
				</p>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'status',
		width: '10%',
	},
	{
		label: 'Online',
		value: 'published',
		width: '5%',
		component(value, { published }) {
			return (
				<span
					className={classnames('fa fa-circle', [
						published ? 'u-text-success' : 'u-text-danger',
					])}
				/>
			);
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '10%',
		component(value, { navigate, canUpdate }) {
			return (
				<>
					{canUpdate ? (
						<Button
							ariaLabel="Edit"
							icon="edit"
							onClick={() => navigate(MODULE_PATHS.detailEdit)}
							type="primary"
							transparent
						/>
					) : null}
				</>
			);
		},
	},
];
