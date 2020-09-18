import { ContentTypeModel } from '../store/contentTypes';

export const getInitialContentValues = (
	contentType: ContentTypeModel,
	data: Record<string, any> = {}
): Record<string, any> => {
	if (!contentType || !Array.isArray(contentType.fields)) {
		return {};
	}
	const { fields } = contentType;

	return fields.reduce((values, field) => {
		values[field.name] = data[field.name] ?? field.defaultValue ?? undefined;

		return values;
	}, {} as Record<string, any>);
};
