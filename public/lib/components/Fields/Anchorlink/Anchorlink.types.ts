import {
	ContentTypeFieldSchema,
	FieldSchema,
	FormValues,
	InputFieldProps,
} from '@redactie/form-renderer-module';
import { FieldProps } from 'formik';

export interface AnchorlinkValue {
	link: string;
	label: string;
}

export interface AnchorlinkFieldProps extends Omit<InputFieldProps, 'fieldProps'> {
	fieldProps: FieldProps<AnchorlinkValue, FormValues>;
}

export interface TextFieldValue {
	text: string;
	textType: string;
}

export interface DynamicRepeaterItem<Value = unknown> {
	value: Value;
	uuid: string;
	type: string;
	fieldRef: string;
	fieldType: string;
	preset?: string;
}

export interface MultipleItem<Value = unknown> {
	value: Value;
	uuid: string;
}

export interface SelectOption {
	label: string;
	key?: string;
	value: string | number | boolean;
	disabled?: boolean;
}

export type FieldSchemaForAnchorlink = (FieldSchema | ContentTypeFieldSchema) & {
	_jsonPointerName?: string[];
};
