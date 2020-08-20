import { FormSchema } from '@redactie/form-renderer-module';
import { FormikValues } from 'formik';

import { ContentTypeSchema } from '../services/contentTypes';

import { parseFields } from './parseFields';

export const getViewPropsByCT = (
	contentType: ContentTypeSchema,
	values: FormikValues
): { schema: FormSchema; values: FormikValues } => {
	return {
		schema: {
			fields: parseFields(contentType.fields),
		},
		values,
	};
};
