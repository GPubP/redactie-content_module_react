import { object, string } from 'yup';

export const META_VALIDATION_SCHEMA = object().shape({
	label: string().required('Gelieve een werktitel in te vullen'),
	slug: object({
		nl: string().required('Gelieve een slug in te vullen'),
	}),
});
