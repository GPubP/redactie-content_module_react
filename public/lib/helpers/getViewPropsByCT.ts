import { FormSchema } from '@redactie/form-renderer-module';
import { FormikValues } from 'formik';

import { parseFields } from '../connectors/formRenderer';
import { ContentTypeSchema } from '../services/contentTypes';

import { getInitialContentValues } from './getInitialContentValues';

export const getViewPropsByCT = (
	contentType: ContentTypeSchema,
	values: FormikValues
): { schema: FormSchema; values: FormikValues } => {
	return {
		schema: {
			fields: parseFields(contentType.fields),
		},
		values: getInitialContentValues(contentType?.fields, values),
	};
};
