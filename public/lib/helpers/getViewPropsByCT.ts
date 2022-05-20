import { FormSchema } from '@redactie/form-renderer-module';
import { FormikValues } from 'formik';

import formRendererConnector from '../connectors/formRenderer';
import { ContentTypeSchema } from '../services/contentTypes';

import { contentTypeHelpers } from './contentType';
import { getInitialContentValues } from './getInitialContentValues';

export const getViewPropsByCT = (
	contentType: ContentTypeSchema,
	values: FormikValues,
	activeLanguageKey?: string
): { schema: FormSchema; values: FormikValues } => {
	const compartments = contentTypeHelpers.getCompartments(contentType);
	const fields = contentTypeHelpers.getFieldsByCompartments(contentType.fields, compartments);
	return {
		schema: {
			fields: formRendererConnector.api.parseFields(fields, { activeLanguageKey } as any),
		},
		values: getInitialContentValues(fields, values, activeLanguageKey),
	};
};
