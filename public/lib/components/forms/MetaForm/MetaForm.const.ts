import { object, ObjectSchema, string } from 'yup';

import { ContentCompartmentsValidateOptions } from '../../../store/ui/contentCompartments';

import { validatieSlugDebouncedWrapper } from './MetaForm.helpers';

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
					test: validatieSlugDebouncedWrapper(siteId, 'nl', contentId, options),
				}),
		}),
	});
