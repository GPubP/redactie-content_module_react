import { FormSchema } from '@redactie/form-renderer-module';
import { FormikValues } from 'formik';

import formRendererConnector from '../connectors/formRenderer';
import { ContentTypeSchema } from '../services/contentTypes';

import { contentTypeHelpers } from './contentType';
import { getInitialContentValues } from './getInitialContentValues';

export const getViewPropsByCT = (
	contentType: ContentTypeSchema,
	values: FormikValues
): { schema: FormSchema; values: FormikValues } => {
	const compartments = contentTypeHelpers.getCompartments(contentType);
	const fields = contentTypeHelpers.getFieldsByCompartments(contentType.fields, compartments);
	return {
		schema: {
			fields: formRendererConnector.api.parseFields(fields),
		},
		values: getInitialContentValues(fields, values),
	};
};
