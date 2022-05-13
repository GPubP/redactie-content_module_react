import { ModuleSettings } from '@redactie/sites-module';
import { date, object, Schema, string } from 'yup';

import { ContentCompartmentsValidateOptions } from '../../../store/ui/contentCompartments';

import { default as MetaFormHelper } from './MetaForm.helpers';

export const META_VALIDATION_SCHEMA = (
	siteId: string,
	activeLanguage?: string,
	contentId?: string,
	options: ContentCompartmentsValidateOptions = { async: true, allowedTransitions: [] },
	isPage?: boolean,
	modulesConfig?: ModuleSettings
): Schema<unknown> =>
	isPage && !modulesConfig
		? object().shape({
				slug: object({
					[activeLanguage || 'nl']: string()
						.required('Gelieve een slug in te vullen')
						.test({
							name: 'noDuplicateSlug',
							message: 'Deze slug bestaat reeds',
							test: MetaFormHelper.validatieSlugDebouncedWrapper(
								siteId,
								activeLanguage || 'nl',
								contentId,
								options
							),
						}),
				}),
				issuedOn: date().nullable(true),
		  })
		: object().shape({});
