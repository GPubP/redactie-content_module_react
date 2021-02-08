import debounce from 'lodash.debounce';
import { object, ObjectSchema, string } from 'yup';

import { contentApiService } from '../../../services/content';

const debouncedValdation = (siteId: string): ((slug: string) => Promise<boolean>) =>
	debounce(async (slug: string) => {
		const payload = { language: 'nl', slug };
		const response = await contentApiService.validateSlug(siteId, payload);
		console.log(response);
		return false;
	}, 1000);

export const META_VALIDATION_SCHEMA = (siteId: string): ObjectSchema<any> =>
	object().shape({
		slug: object({
			nl: string()
				.required('Gelieve een slug in te vullen')
				.test({
					name: 'noDuplicateSlug',
					message: value => `Slug ${value.originalValue} bestaat reeds`,
					test: debouncedValdation(siteId),
				}),
		}),
	});
