import { FieldSchema, FormSchema } from '@redactie/form-renderer-module';

import { WORKING_TITLE_KEY } from '../content.const';
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
					guideline: '',
				},
				config = {
					fields: [],
					guideline: null,
				},
				name,
				fieldType,
				dataType,
				label,
				preset,
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
					description: generalConfig.guideline,
					preset,
				},
				fields: parseFields(config.fields),
				dataType: dataType.data.type,
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
						description: config.guideline,
					},
					fields: [
						{
							...formField,
							name: 'value',
						} as FieldSchema,
					],
				};
			}

			return formField as FieldSchema;
		}
	);
};

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
					description: '',
					fields: [],
					guideline: 'Geef een werktitel op voor dit item.',
					hidden: false,
					max: 1,
					min: 0,
					multiLanguage: false,
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
