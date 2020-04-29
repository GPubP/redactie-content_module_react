import { Button } from '@acpaas-ui/react-components';
import moment from 'moment';
import React from 'react';

import { ContentOverviewTableRow } from './ContentOverview.types';

export const CONTENT_TYPES_SEARCH_OPTIONS = {
	skip: 0,
	limit: -1,
};

export const CONTENT_OVERVIEW_COLUMNS = [
	{
		label: 'Titel',
		value: 'label',
	},
	{
		label: 'Type',
		value: 'contentType',
	},
	{
		label: 'Laatst bijgewerkt',
		value: 'lastModified',
		format: (data: string) => moment(data).format('DD/MM/YYYYY [-] hh[u]mm'),
	},
	{
		label: 'Auteur',
		value: 'lastEditor',
	},
	{
		label: 'Status',
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
