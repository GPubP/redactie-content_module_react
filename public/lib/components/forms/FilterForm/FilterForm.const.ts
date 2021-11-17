import { object, string } from 'yup';

import {
	CONTENT_EXTRA_FILTER_TRANSLATION_MAP,
	ContentExtraFilterStatus,
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
