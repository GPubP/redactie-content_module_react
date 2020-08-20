import { FormSchema } from '@redactie/form-renderer-module';

import { ContentTypeSchema, ErrorMessagesSchema, ValidateSchema } from '../services/contentTypes';

import { parseFields } from './parseFields';

export const getFormPropsByCT = (
	contentType: ContentTypeSchema
): { schema: FormSchema; validationSchema: ValidateSchema; errorMessages: ErrorMessagesSchema } => {
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
