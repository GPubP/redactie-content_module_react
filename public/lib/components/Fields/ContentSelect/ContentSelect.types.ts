import { InputFieldProps } from '@redactie/form-renderer-module';
import { FieldHelperProps } from 'formik';

import { ContentModel } from '../../../store/content';

export type ContentSelectProps = InputFieldProps & {
	fieldHelperProps: FieldHelperProps<any> & {
		setInitialValue?: (value: ContentModel) => void;
	};
};
