import { FormValues, InputFieldProps } from '@redactie/form-renderer-module';
import { FieldProps, FormikValues } from 'formik';

import { CrossSiteContentSelectValue } from '../Fields/CrossSiteContentSelect/CrossSiteContentSelect.types';

interface ContentSelectItem {
	value: string | undefined;
	label: string;
	contentTypeId: string;
}

export interface ContentSelectBaseProps
	extends Omit<InputFieldProps, 'fieldHelperProps' | 'fieldProps'> {
	fieldProps:
		| FieldProps<CrossSiteContentSelectValue, FormValues>
		| FieldProps<string, FormikValues>;
	to: string;
	getItems: (cb: (options: any[]) => void) => Promise<void>;
	setValue: (uuid: string) => void;
	items: ContentSelectItem[];
	currentItem: ContentSelectItem | undefined;
	searchParams: Record<string, string | number | boolean>;
}
