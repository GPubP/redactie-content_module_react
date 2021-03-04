import {
	ContentTypeFieldSchema,
	FieldSchema,
	FormSchema,
	FormValues,
} from '@redactie/form-renderer-module';
import { FormikValues } from 'formik';
import pointer from 'json-pointer';
import { is, prop } from 'ramda';

import { ContentTypeSchema } from '../../../api/api.types';

import {
	DynamicRepeaterItem,
	FieldSchemaForAnchorlink,
	MultipleItem,
	SelectOption,
	TextFieldValue,
} from './Anchorlink.types';

const generateAnchorlinkOption = (fieldPath: string[], value: string): SelectOption => {
	const jsonPointer = pointer.compile(fieldPath);
	return {
		label: value,
		key: jsonPointer,
		value: jsonPointer,
	};
};

const parseFieldNameToPath = (field: FieldSchemaForAnchorlink): string[] => [
	...(field._jsonPointerName ? field._jsonPointerName : [field.name]),
];

const handlePreset = (field: FieldSchemaForAnchorlink, values: FormikValues): SelectOption[] =>
	Object.keys(values).reduce((acc, key: string) => {
		const value = prop(key)(values) as any;
		const subField = field.config?.fields.find((f: FieldSchema) => key === f.name);

		if (!subField || !value) {
			return acc;
		}

		if (
			!subField.config?.textType?.isAnchorlink &&
			is(Object)(value) &&
			!Array.isArray(value) &&
			Array.isArray(subField?.config?.fields)
		) {
			return [
				...acc,
				...handlePreset(
					{
						...subField,
						_jsonPointerName: [...parseFieldNameToPath(field), subField.name],
					},
					value
				),
			];
		}

		if (value?.text && !!subField.config?.textType?.isAnchorlink) {
			return [
				...acc,
				generateAnchorlinkOption([...parseFieldNameToPath(field), `${key}`], value.text),
			];
		}

		return acc;
	}, [] as SelectOption[]);

const handleMultiple = (field: FieldSchemaForAnchorlink, values: FormikValues): SelectOption[] => {
	return values.reduce(
		(acc: SelectOption[], value: MultipleItem<TextFieldValue>) => [
			...acc,
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			...parseFieldToAnchorLink(
				{
					...field,
					// No need to rerendering it as a multiple since we are inside it
					config: {
						...field.config,
						max: 1,
					},
					...((field as ContentTypeFieldSchema).generalConfig
						? {
								generalConfig: {
									...(field as ContentTypeFieldSchema).generalConfig,
									max: 1,
								},
						  }
						: {}),
					_jsonPointerName: [...parseFieldNameToPath(field), 'uuid', value.uuid],
				},
				value.value
			),
		],
		[]
	);
};

const handleParagraph = (field: FieldSchemaForAnchorlink, values: FormikValues): SelectOption[] =>
	values.reduce((acc: SelectOption[], value: DynamicRepeaterItem<TextFieldValue>) => {
		const subField = field.config?.fields.find((f: FieldSchema) => value.fieldRef === f.uuid);

		if (!subField || !value?.value) {
			return acc;
		}

		if (
			!subField.config?.textType?.isAnchorlink &&
			is(Object)(value?.value) &&
			!Array.isArray(value?.value) &&
			Array.isArray(subField.config?.fields)
		) {
			return [
				...acc,
				...handlePreset(
					{
						...subField,
						_jsonPointerName: [...parseFieldNameToPath(field), subField.name],
					},
					value.value
				),
			];
		}

		if (value?.value?.text && !!subField.config?.textType?.isAnchorlink) {
			return [
				...acc,
				generateAnchorlinkOption(
					[...parseFieldNameToPath(field), 'uuid', `${value.uuid}`],
					value.value.text
				),
			];
		}
		return acc;
	}, [] as SelectOption[]);

function parseFieldToAnchorLink(
	field: ContentTypeFieldSchema | FieldSchema | FieldSchemaForAnchorlink,
	value: any
): SelectOption[] {
	// Field is a multiple field
	if (
		Array.isArray(value) &&
		((field?.config?.max && field.config.max !== 1) ||
			((field as ContentTypeFieldSchema)?.generalConfig?.max &&
				(field as ContentTypeFieldSchema)?.generalConfig?.max !== 1))
	) {
		return handleMultiple(field, value);
	}

	// Field is a preset
	if (
		!field.config?.textType?.isAnchorlink &&
		is(Object)(value) &&
		!Array.isArray(value) &&
		Array.isArray(field.config?.fields)
	) {
		return handlePreset(field, value);
	}

	// Field is a paragraph
	if (
		!field.config?.textType?.isAnchorlink &&
		Array.isArray(value) &&
		Array.isArray(field.config?.fields)
	) {
		return handleParagraph(field, value);
	}

	// Field is not a text field or is not marked as possible anchorlink
	if (!value?.text || !field.config?.textType?.isAnchorlink) {
		return [];
	}

	// Field is a single item
	return [generateAnchorlinkOption([field.name], value.text)];
}

const parseAnchorLinkOptionsOfParseFields = (
	schema: FormSchema | ContentTypeSchema,
	values: FormValues,
	required: boolean
): SelectOption[] =>
	((schema?.fields as (ContentTypeFieldSchema | FieldSchema)[]) || []).reduce(
		(acc: SelectOption[], field: ContentTypeFieldSchema | FieldSchema) => {
			const newOptions = parseFieldToAnchorLink(field, values[field.name]);

			return [...acc, ...newOptions];
		},
		[
			{
				value: '',
				key: '',
				label: required ? 'Selecteer een anchorlink' : 'Geen anchorlink',
				disabled: required,
			},
		] as SelectOption[]
	);

export const parseAnchorlinkOptions = (
	schema: FormSchema,
	values: FormValues,
	required: boolean,
	contentType: ContentTypeSchema | null
): SelectOption[] => parseAnchorLinkOptionsOfParseFields(contentType || schema, values, required);
