import { parseFields } from '../connectors/formRenderer';
import { WORKING_TITLE_KEY } from '../content.const';
import { ContentTypeSchema, ValidateSchema } from '../services/contentTypes';
import { FormRendererProps } from '../views/ContentForm/ContentForm.types';

export const getFormPropsByCT = (contentType: ContentTypeSchema): FormRendererProps => {
	return {
		schema: {
			fields: parseFields(contentType.fields),
		},
		validationSchema: contentType.validateSchema,
		errorMessages: contentType.errorMessages || {},
	};
};

// TODO: export this from form-renderer module?
export const parseValidationSchema = (schema: ValidateSchema, path?: string): ValidateSchema => ({
	...schema,
	properties:
		schema.properties &&
		Object.keys(schema.properties).reduce((acc, key) => {
			const p = path === undefined ? key : `${path}.${key}`;

			if (schema.properties) {
				acc[key] = parseValidationSchema(schema?.properties[key], p);
			}

			return acc;
		}, {} as Record<string, ValidateSchema>),
	items: schema.items && parseValidationSchema(schema.items, `${path}[$]`),
	name: path,
});

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
		required: [...(formProps.validationSchema.required || []), WORKING_TITLE_KEY],
		properties: {
			[WORKING_TITLE_KEY]: {
				minLength: 1,
				type: 'string',
			},
			...formProps.validationSchema.properties,
		},
	},
	errorMessages: {
		...formProps.errorMessages,
		[WORKING_TITLE_KEY]: {
			required: 'Dit veld is verplicht',
			minLength: 'Dit veld is verplicht',
		},
	},
});
