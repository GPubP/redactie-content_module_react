import { FormValues, InputFieldProps } from '@redactie/form-renderer-module';
import { FieldProps } from 'formik';

export interface CrossSiteContentSelectValue {
	siteId: string;
	contentId: string;
	isCrossSite: boolean;
}

export interface CrossSiteContentSelectFieldProps extends Omit<InputFieldProps, 'fieldProps'> {
	fieldProps: FieldProps<CrossSiteContentSelectValue, FormValues>;
}
