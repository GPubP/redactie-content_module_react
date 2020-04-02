import { FieldSchema, FormSchema } from '@redactie/form-renderer-module';

import { ContentTypeSchema, ErrorMessagesSchema, ValidateSchema } from '../contentTypes';

export const getFormPropsByCT = (
	contentType: ContentTypeSchema
): { schema: FormSchema; validationSchema: ValidateSchema; errorMessages: ErrorMessagesSchema } => {
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
		validationSchema: contentType.validateSchema,
		errorMessages: contentType.errorMessages,
	};
};
