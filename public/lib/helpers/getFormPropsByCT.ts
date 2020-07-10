import { FieldSchema, FormSchema } from '@redactie/form-renderer-module';

import {
	ContentTypeFieldSchema,
	ContentTypeSchema,
	ErrorMessagesSchema,
	ValidateSchema,
} from '../services/contentTypes';

const parseFields = (fields: ContentTypeFieldSchema[] = []): FieldSchema[] => {
	return fields.map(
		(field): FieldSchema => {
			const {
				generalConfig = {
					min: 0,
					max: 1,
				},
				config = {
					fields: [],
				},
				name,
				fieldType,
				label,
			} = field;
			const isMultiple = generalConfig.max > 1;

			const formField = {
				name: name,
				module: fieldType?.data?.module,
				label: !isMultiple ? label : null,
				type: fieldType?.data?.componentName,
				config: {
					...config,
					...generalConfig,
				},
				fields: parseFields(config.fields),
				dataType: 'string',
			};

			if (isMultiple) {
				return {
					name: name,
					module: 'core',
					label: label,
					type: 'repeater',
					dataType: 'array',
					config: {
						...config,
						...generalConfig,
					},
					fields: [formField as FieldSchema],
				};
			}

			return formField as FieldSchema;
		}
	);
};

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
