import { Button } from '@acpaas-ui/react-components';
import React from 'react';

import { ContentCreateOverviewTableRow } from './ContentCreateOverview.types';

export const CONTENT_CREATE_OVERVIEW_COLUMNS = [
	{
		label: 'Naam',
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
				<Button outline onClick={() => navigate(uuid)} type="primary">
					Nieuw aanmaken
				</Button>
			);
		},
	},
];
