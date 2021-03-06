import { path, pathOr } from 'ramda';

import { ContentTypeFieldSchema } from '../api/api.types';

import { getLanguageValue } from './getLanguageValue';

const setFieldValue = (dataValue: any, defaultValue: any, fallback: any): any =>
	dataValue !== undefined && typeof dataValue !== 'function'
		? dataValue
		: defaultValue ?? fallback;

export const getInitialContentValues = (
	fields: ContentTypeFieldSchema[],
	data: Record<string, any> = {},
	language?: string
): Record<string, any> => {
	if (!Array.isArray(fields)) {
		return {};
	}

	return fields.reduce((values, field) => {
		const defaultValue = getLanguageValue(field.defaultValue, language);

		if (
			field?.preset &&
			field.config?.fields?.length &&
			field.generalConfig.max &&
			field.generalConfig.max <= 1
		) {
			values[field.name] =
				field.generalConfig.required || data[field.name] || defaultValue
					? getInitialContentValues(
							field.config?.fields,
							setFieldValue(data[field.name], defaultValue, {}),
							language
					  )
					: '';
			return values;
		}

		// If our data is an array and the config is set to singular + we have checked it SHOULDN'T be an array:
		// Try to pick the first object of the array and cast it down
		if (
			Array.isArray(data[field.name]) &&
			['object', 'string', 'number'].includes(field.dataType.data.type) &&
			field.generalConfig.max <= 1
		) {
			values[field.name] = setFieldValue(
				pathOr(path([field.name, 0])(data), [field.name, 0, 'value'])(data),
				defaultValue,
				{}
			);

			return values;
		}

		values[field.name] = setFieldValue(data[field.name], defaultValue, '');

		return values;
	}, {} as Record<string, any>);
};
