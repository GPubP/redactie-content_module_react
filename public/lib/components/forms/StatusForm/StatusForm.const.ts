import { object, string } from 'yup';

import { ContentStatus } from '../../../services/content';

import { StatusFormOption } from './StatusForm.types';

export const STATUS_VALIDATION_SCHEMA = object().shape({
	status: string().required(),
});

/**
 * TODO:
 * SCHEDULED mappen naar DRAFT
 *
 * Add UNPUBLISHED option (gearchiveerd)
 */
export const STATUS_OPTIONS: StatusFormOption[] = [
	{
		key: '0',
		value: ContentStatus.DRAFT,
		label: 'Werkversie',
	},
	{
		key: '1',
		value: ContentStatus.PENDING_REVIEW,
		label: 'Klaar voor nakijken',
	},
	{
		key: '2',
		value: ContentStatus.PENDING_PUBLISH,
		label: 'Klaar voor publicatie',
	},
	{
		key: '3',
		value: ContentStatus.PUBLISHED,
		label: 'Gepubliceerd',
	},
	{
		key: '4',
		value: ContentStatus.UNPUBLISHED,
		label: 'Gearchiveerd',
	},
];
