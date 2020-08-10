import { object, string } from 'yup';

import { ContentStatus } from '../../../services/content';

export const STATUS_VALIDATION_SCHEMA = object().shape({
	status: string().required(),
});

/**
 * TODO:
 * SCHEDULED mappen naar DRAFT
 *
 * Add UNPUBLISHED option (gearchiveerd)
 */
export const STATUS_OPTIONS = [
	{
		key: '0',
		value: ContentStatus.DRAFT,
		label: 'Werkversie (huidige status)',
	},
	{
		key: '1',
		value: ContentStatus.PENDING,
		label: 'Klaar voor nakijken',
	},
	{
		key: '2',
		value: ContentStatus.PUBLISHED,
		label: 'Gepubliceerd',
	},
];
