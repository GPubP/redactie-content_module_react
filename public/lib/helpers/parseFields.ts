import { FieldSchema } from '@redactie/form-renderer-module';

import { ContentTypeFieldSchema } from '../services/contentTypes';

export const parseFields = (fields: ContentTypeFieldSchema[] = []): FieldSchema[] => {
	return fields.reduce((acc, field) => {
		const {
			generalConfig = {
				min: 0,
				max: 1,
				guideline: '',
				hidden: false,
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

		// Don't show field when it is a hidden field
		if (generalConfig.hidden) {
			return acc;
		}

		const formField = {
			name: name,
			module: fieldType?.data?.module,
			label: !isMultiple ? label : null,
			type: fieldType?.data?.componentName,
			view: preset ? preset.data.name : '',
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
			acc.push({
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
			});
			return acc;
		}

		acc.push(formField as FieldSchema);
		return acc;
	}, [] as FieldSchema[]);
};