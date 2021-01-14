import { object, string } from 'yup';

import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../../services/content';

import { PublishedStatuses } from './FilterForm.types';

export const CONTENT_TYPES_SEARCH_OPTIONS = {
	skip: 0,
	limit: -1,
	sparse: true,
};

export const FILTER_FORM_VALIDATION_SCHEMA = object().shape({
	name: string().required(),
});

export const CONTENT_TYPES_PLACEHOLDER = 'Selecteer een content type';

export const STATUS_DEFAULT_OPTION = {
	key: 'default-option',
	label: 'Selecteer een status',
	value: '',
	disabled: true,
};

export const PUBLISHED_DEFAULT_OPTION = {
	key: 'default-option',
	label: 'Online / Offline',
	value: '',
	disabled: true,
};

export const FILTER_STATUS_OPTIONS = [
	{
		key: '0',
		value: ContentStatus.PUBLISHED,
		label: CONTENT_STATUS_TRANSLATION_MAP.PUBLISHED,
	},
	{
		key: '1',
		value: ContentStatus.DRAFT,
		label: CONTENT_STATUS_TRANSLATION_MAP.DRAFT,
	},
	{
		key: '2',
		value: ContentStatus.SCHEDULED,
		label: CONTENT_STATUS_TRANSLATION_MAP.SCHEDULED,
	},
	{
		key: '3',
		value: ContentStatus.PENDING,
		label: CONTENT_STATUS_TRANSLATION_MAP.PENDING,
	},
	{
		key: '3',
		value: ContentStatus.UNPUBLISHED,
		label: CONTENT_STATUS_TRANSLATION_MAP.UNPUBLISHED,
	},
];

export const PUBLISHED_OPTIONS = [
	{
		key: '0',
		value: PublishedStatuses.ONLINE,
		label: 'Online',
	},
	{
		key: '1',
		value: PublishedStatuses.OFFLINE,
		label: 'Offline',
	},
];
