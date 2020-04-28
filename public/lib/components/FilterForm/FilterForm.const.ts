import { object, string } from 'yup';

export const FILTER_FORM_VALIDATION_SCHEMA = object().shape({
	name: string().required(),
});

export const CONTENT_TYPES_DEFAULT_OPTION = {
	key: 'default-option',
	label: 'Selecteer een content type',
	value: '',
	disabled: true,
};

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

export const STATUS_OPTIONS = [
	{
		key: '0',
		value: 'published',
		label: 'Gepubliceerd',
	},
	{
		key: '1',
		value: 'draft',
		label: 'Concept',
	},
	{
		key: '2',
		value: 'scheduled',
		label: 'Gepland',
	},
	{
		key: '3',
		value: 'pending',
		label: 'In wacht',
	},
];
export const ONLINE_OPTIONS = [
	{
		key: '0',
		value: 'online',
		label: 'Online',
	},
	{
		key: '1',
		value: 'offline',
		label: 'Offline',
	},
];
