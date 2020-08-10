import * as Yup from 'yup';

export const MetaFormValidationSchema = Yup.object().shape({
	label: Yup.string().required('Gelieve een werktitel in te vullen'),
	slug: Yup.object({
		nl: Yup.string().required('Gelieve een slug in te vullen'),
	}),
});
