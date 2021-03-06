import { ContentTypeSchema } from '../api/api.types';
import { CtTypeSettings, FormRendererProps } from '../views/ContentForm/ContentForm.types';

import { addWorkingTitleField, getFormPropsByCT } from './getFormPropsByCT';

export const getCompartmentFormProps = (
	contentType: ContentTypeSchema,
	settings: CtTypeSettings,
	activeLanguageKey?: string
): FormRendererProps => {
	const formProps = getFormPropsByCT(
		{
			...contentType,
			valueSyncMap: settings.valueSyncMap,
			fields: settings.fields,
			validateSchema: settings.validateSchema,
			errorMessages: settings.errorMessages,
		},
		activeLanguageKey
	);

	return settings.includeWorkingTitle ? addWorkingTitleField(formProps) : formProps;
};
