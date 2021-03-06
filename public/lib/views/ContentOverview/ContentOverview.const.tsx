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
	sort: { defaultValue: DEFAULT_CONTENT_SEARCH_PARAMS.sort, type: 'string' },
	direction: { defaultValue: DEFAULT_CONTENT_SEARCH_PARAMS.direction, type: 'number' },
	search: { type: 'string' },
	contentTypes: { type: 'array' },
	lang: { type: 'array' },
	lastModifiedFrom: { type: 'string' },
	lastModifiedTo: { type: 'string' },
	['latest-status']: { type: 'string' },
	published: { type: 'string' },
	creator: { type: 'string' },
} as const;

export const DEFAULT_OVERVIEW_QUERY_PARAMS = {
	...DEFAULT_CONTENT_SEARCH_PARAMS,
	search: undefined,
	contentTypes: undefined,
	lastModifiedFrom: undefined,
	lastModifiedTo: undefined,
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
		component(label: string, { type }) {
			return (
				<>
					<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
					<p className="small">
						{type ? <EllipsisWithTooltip>{type}</EllipsisWithTooltip> : ''}
					</p>
				</>
			);
		},
	},
	{
		label: 'Taal',
		value: 'lang',
		ellipsis: true,
		width: '5%',
		disableSorting: true,
		component(language: string) {
			return <>{language?.toUpperCase()}</>;
		},
	},
	{
		label: t(CORE_TRANSLATIONS['TABLE_LAST-MODIFIED']),
		value: 'lastEdit',
		width: '15%',
		format: (data: string) => moment(data).format(DATE_FORMATS.dateAndTime),
	},
	{
		label: 'Laatst bijgewerkt door',
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
		component(value: string) {
			return <EllipsisWithTooltip>{value}</EllipsisWithTooltip>;
		},
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

export const ORDER_BY_KEYMAP: Record<string, string> = {
	lastEdit: 'meta.historySummary.lastEdit',
	contentType: 'meta.contentType.meta.label',
	status: 'meta.historySummary.latestStatus',
};
