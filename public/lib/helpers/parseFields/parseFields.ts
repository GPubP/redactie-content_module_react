import { FieldSchema } from '@redactie/form-renderer-module';
import { omit } from 'ramda';

import { ContentTypeFieldSchema } from '../../services/contentTypes';

export const parseFields = (fields: ContentTypeFieldSchema[] = []): FieldSchema[] => {
	const getFieldSchema = (field: ContentTypeFieldSchema): FieldSchema => {
		const {
			generalConfig = {
				min: 0,
				max: 1,
				hidden: false,
				guideline: '',
			},
			config = {
				fields: [],
			},
			name,
			fieldType = {
				data: {
					module: 'core',
					componentName: 'text',
					generalConfig: {
						defaultGuideline: '',
						defaultLabel: '',
					},
				},
			},
			dataType,
			label,
			preset,
		} = field;
		const isMultiple = (generalConfig.max || 0) > 1;
		const isPreset = !!preset;
		// Type is set to any because uuid is not a known prop on FieldSchema
		const formField: FieldSchema = {
			name,
			label,
			module: fieldType?.data?.module,
			type: fieldType?.data?.componentName,
			view: preset
				? preset.data?.viewComponentName
					? preset.data?.viewComponentName
					: preset.data.name
				: '',
			dataType: dataType.data.type,
			fields: parseFields(config.fields),
			uuid: field.uuid,
			config: {
				...config,
				...generalConfig,
				description: generalConfig.guideline,
				preset,
				fieldType,
				dataType,
			},
		};

		if (isMultiple) {
			/**
			 * Use default guideline and label when rendering a field type in multiple mode
			 */
			if (!isPreset) {
				formField.config = {
					...formField.config,
					description: fieldType.data.generalConfig.defaultGuideline,
				};
				// TODO: label is required in the form renderer
				// Fix this when the label is not required anymore
				formField.label = (fieldType.data.generalConfig.defaultLabel as unknown) as string;
			}

			/**
			 * Remove the guideline and label from the preset when rendering a preset in multiple mode
			 * The label and guideline will be visible on top of the repeater field
			 */
			if (isPreset) {
				formField.config = omit(['description'], formField.config);
				// TODO: label is required in the form renderer
				// Fix this when the label is not required anymore
				formField.label = (null as unknown) as string;
			}

			return {
				name,
				module: 'core',
				label,
				type: 'repeater',
				dataType: 'array',
				config: {
					...config,
					...generalConfig,
					description: generalConfig.guideline,
				},
				fields: [
					{
						...formField,
						name: 'value',
					} as FieldSchema,
				],
			};
		}

		return formField;
	};

	return fields.reduce((acc, field) => {
		const {
			generalConfig = {
				hidden: false,
			},
		} = field;

		// Don't show field when it is a hidden field
		if (generalConfig.hidden) {
			return acc;
		}

		acc.push(getFieldSchema(field));

		return acc;
	}, [] as FieldSchema[]);
};
