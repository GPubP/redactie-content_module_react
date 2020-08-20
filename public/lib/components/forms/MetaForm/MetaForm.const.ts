import { object, string } from 'yup';

export const META_VALIDATION_SCHEMA = object().shape({
	slug: object({
		nl: string().required('Gelieve een slug in te vullen'),
	}),
});
