import { FieldSchema, FormSchema } from '@redactie/form-renderer-module';

import { FilterFormState } from '../../content.types';
import { ContentTypeSchema, ErrorMessagesSchema, ValidateSchema } from '../contentTypes';

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
			fields: contentType.fields.map(
				(field): FieldSchema => {
					return {
						name: field.name,
						module: field.fieldType?.data?.module,
						label: field.label,
						type: field.fieldType?.data?.componentName,
						config: field.config,
						dataType: 'string',
					};
				}
			),
		},
		validationSchema: validateSchema,
		errorMessages: contentType.errorMessages || {},
	};
};

export const generateFilterFormState = (): FilterFormState => ({
	search: '',
	contentType: '',
	author: '',
	theme: '',
});
