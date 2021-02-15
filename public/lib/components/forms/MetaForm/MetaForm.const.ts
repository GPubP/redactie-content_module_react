import { object, ObjectSchema, string } from 'yup';

import { ContentCompartmentsValidateOptions } from '../../../store/ui/contentCompartments';

import { default as MetaFormHelper } from './MetaForm.helpers';

export const META_VALIDATION_SCHEMA = (
	siteId: string,
	contentId?: string,
	options: ContentCompartmentsValidateOptions = { async: true }
): ObjectSchema<any> =>
	object().shape({
		slug: object({
			nl: string()
				.required('Gelieve een slug in te vullen')
				.test({
					name: 'noDuplicateSlug',
					message: 'Deze slug bestaat reeds',
					test: MetaFormHelper.validatieSlugDebouncedWrapper(
						siteId,
						'nl',
						contentId,
						options
					),
				}),
		}),
	});
