import { ContentTypeSchema } from '../api/api.types';
import { CtTypeSettings, FormRendererProps } from '../views/ContentForm/ContentForm.types';

import { addWorkingTitleField, getFormPropsByCT } from './getFormPropsByCT';

export const getCompartmentFormProps = (
	contentType: ContentTypeSchema,
	settings: CtTypeSettings
): FormRendererProps => {
	const formProps = getFormPropsByCT({
		...contentType,
		fields: settings.fields,
		validateSchema: settings.validateSchema,
		errorMessages: settings.errorMessages,
	});

	return settings.includeWorkingTitle ? addWorkingTitleField(formProps) : formProps;
};
