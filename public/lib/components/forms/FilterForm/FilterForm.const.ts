import { object, string } from 'yup';

import {
	CONTENT_EXTRA_FILTER_TRANSLATION_MAP,
	CONTENT_STATUS_TRANSLATION_MAP,
	ContentExtraFilterStatus,
	ContentStatus,
} from '../../../services/content';

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
		value: ContentExtraFilterStatus.ALL,
		label: CONTENT_EXTRA_FILTER_TRANSLATION_MAP.ALL,
	},
	{
		key: '1',
		value: ContentStatus.PUBLISHED,
		label: CONTENT_STATUS_TRANSLATION_MAP.PUBLISHED,
	},
	{
		key: '2',
		value: ContentStatus.DRAFT,
		label: CONTENT_STATUS_TRANSLATION_MAP.DRAFT,
	},
	{
		key: '3',
		value: ContentStatus.SCHEDULED,
		label: CONTENT_STATUS_TRANSLATION_MAP.SCHEDULED,
	},
	{
		key: '4',
		value: ContentStatus.PENDING_REVIEW,
		label: CONTENT_STATUS_TRANSLATION_MAP.PENDING_REVIEW,
	},
	{
		key: '5',
		value: ContentStatus.PENDING_PUBLISH,
		label: CONTENT_STATUS_TRANSLATION_MAP.PENDING_PUBLISH,
	},
	{
		key: '6',
		value: ContentStatus.UNPUBLISHED,
		label: CONTENT_STATUS_TRANSLATION_MAP.UNPUBLISHED,
	},
];

export const PUBLISHED_OPTIONS = [
	{
		key: '0',
		value: ContentExtraFilterStatus.ALL,
		label: CONTENT_EXTRA_FILTER_TRANSLATION_MAP.ALL,
	},
	{
		key: '1',
		value: PublishedStatuses.ONLINE,
		label: 'Online',
	},
	{
		key: '2',
		value: PublishedStatuses.OFFLINE,
		label: 'Offline',
	},
];
