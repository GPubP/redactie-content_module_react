import { FormSchema } from '@redactie/form-renderer-module';

import { WORKING_TITLE_KEY } from '../content.const';
import { ContentTypeSchema, ErrorMessagesSchema, ValidateSchema } from '../services/contentTypes';

import { parseFields } from './parseFields';

interface FormRendererProps {
	schema: FormSchema;
	validationSchema: ValidateSchema;
	errorMessages: ErrorMessagesSchema;
}

export const getFormPropsByCT = (contentType: ContentTypeSchema): FormRendererProps => {
	const validateSchema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		properties: contentType.validateSchema || {},
	};

	return {
		schema: {
			fields: parseFields(contentType.fields),
		},
		validationSchema: validateSchema,
		errorMessages: contentType.errorMessages || {},
	};
};

export const addWorkingTitleField = (formProps: FormRendererProps): FormRendererProps => ({
	...formProps,
	schema: {
		...formProps.schema,
		fields: [
			{
				config: {
					guideline: 'Geef een werktitel op voor dit item.',
					placeholder: 'Typ een label',
					required: true,
				},
				dataType: 'string',
				fields: [],
				label: 'Werktitel',
				module: 'core',
				name: WORKING_TITLE_KEY,
				type: 'text',
			},
			...formProps.schema.fields,
		],
	},
	validationSchema: {
		...formProps.validationSchema,
		properties: {
			[WORKING_TITLE_KEY]: {
				type: 'string',
			},
			...formProps.validationSchema.properties,
		},
	},
});
