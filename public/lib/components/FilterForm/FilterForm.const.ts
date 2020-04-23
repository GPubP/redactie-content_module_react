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
