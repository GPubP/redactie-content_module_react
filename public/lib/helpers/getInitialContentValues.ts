import { ContentTypeFieldSchema } from '../api/api.types';

export const getInitialContentValues = (
	fields: ContentTypeFieldSchema[],
	data: Record<string, any> = {}
): Record<string, any> => {
	if (!Array.isArray(fields)) {
		return {};
	}

	return fields.reduce((values, field) => {
		if (
			field?.preset?.data.fields.length &&
			field.generalConfig.max &&
			field.generalConfig.max <= 1
		) {
			values[field.name] = getInitialContentValues(
				field.preset.data.fields.map(f => f.field),
				data[field.name] || field.defaultValue
			);

			return values;
		}

		values[field.name] = data[field.name] ?? field.defaultValue ?? undefined;

		return values;
	}, {} as Record<string, any>);
};
