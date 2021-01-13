import kebabCase from 'lodash.kebabcase';
import {
	always,
	clone,
	compose,
	filter,
	find,
	identity,
	ifElse,
	isEmpty,
	omit,
	pick,
	sort,
} from 'ramda';

import {
	CompartmentProps,
	ContentSchema,
	ContentTypeSchema,
	ModuleSettings,
} from '../api/api.types';
import { FieldsForm } from '../components';
import { getCustomValidator } from '../connectors/formRenderer';
import { WORKING_TITLE_KEY } from '../content.const';
import { ContentTypeFieldSchema } from '../services/contentTypes/contentTypes.service.types';
import { ExternalCompartmentModel } from '../store/api/externalCompartments';
import { contentFacade } from '../store/content';
import {
	CompartmentType,
	ContentCompartmentModel,
	ModuleValue,
} from '../store/ui/contentCompartments';
import { CtTypeSettings } from '../views/ContentForm/ContentForm.types';

import { getCompartmentFormProps } from './getCompartmentFormProps';
import { getInitialContentValues } from './getInitialContentValues';

export const getSettings = (
	contentType: ContentTypeSchema,
	compartment: ContentCompartmentModel
): CompartmentProps['settings'] => {
	if (!contentType) {
		return;
	}

	switch (compartment.type) {
		case CompartmentType.CT:
			return compartment.context as CtTypeSettings;
		case CompartmentType.INTERNAL:
			return contentType;
		case CompartmentType.MODULE:
			return compose<
				ModuleSettings[],
				ModuleSettings | undefined,
				ModuleSettings | undefined,
				Pick<ModuleSettings, 'config' | 'validationSchema'>,
				Pick<ModuleSettings, 'config' | 'validationSchema'>
			>(
				clone,
				pick(['config', 'validationSchema']) as any,
				ifElse(identity, identity, always({})),
				find((moduleConfig: ModuleSettings) => moduleConfig.name === compartment.name)
			)(
				contentType.modulesConfig || ([] as ModuleSettings[])
			) as CompartmentProps['settings'];
	}
};

export const getCompartmentValue = (
	content: ContentSchema | undefined,
	compartment: ContentCompartmentModel,
	contentType: ContentTypeSchema
): unknown => {
	if (!content) {
		return;
	}

	switch (compartment.type) {
		case CompartmentType.CT:
			return {
				[WORKING_TITLE_KEY]: content.meta.label,
				...getInitialContentValues(contentType?.fields, content?.fields),
			};
		case CompartmentType.INTERNAL:
			return content?.meta;
		case CompartmentType.MODULE:
			return content?.modulesData?.[compartment.name];
	}
};

export const mapExternalCompartmentToContentCompartment = (
	ec: ExternalCompartmentModel
): ContentCompartmentModel => ({
	label: ec.label,
	afterSubmit: ec.afterSubmit,
	beforeSubmit: ec.beforeSubmit,
	getDescription: ec.getDescription,
	isValid: ec.isValid,
	validate: ec.validate,
	name: ec.name,
	component: ec.component,
	type: CompartmentType.MODULE,
});

export const filterExternalCompartments = (
	content: ContentSchema | undefined,
	contentType: ContentTypeSchema,
	externalCompartments: ExternalCompartmentModel[]
): ContentCompartmentModel[] => {
	return externalCompartments.reduce(
		(acc: ContentCompartmentModel[], ec): ContentCompartmentModel[] => {
			const contentCompartment = mapExternalCompartmentToContentCompartment(ec);

			if (
				content &&
				typeof ec.show === 'function' &&
				!ec.show(
					getSettings(contentType, contentCompartment) as ModuleSettings,
					getCompartmentValue(content, contentCompartment, contentType),
					content,
					contentType
				)
			) {
				return acc;
			}

			if (typeof ec.show === 'boolean') {
				return acc;
			}

			return acc.concat([contentCompartment]);
		},
		[] as ContentCompartmentModel[]
	);
};

const getCTCompartmentErrorMessages = (
	contentType: ContentTypeSchema,
	compartmentFieldNames: string[]
): ContentTypeSchema['validateSchema'] =>
	Object.keys(contentType.errorMessages).reduce((acc, key) => {
		if (!compartmentFieldNames.find(fieldName => key.startsWith(fieldName))) {
			return acc;
		}

		return {
			...acc,
			[key]: contentType.errorMessages[key],
		};
	}, {});

const getCTCompartmentValidationSchema = (
	contentType: ContentTypeSchema,
	compartmentFieldNames: string[]
): ContentTypeSchema['validateSchema'] =>
	Object.keys(contentType.validateSchema.properties).reduce((acc, key) => {
		if (!compartmentFieldNames.includes(key)) {
			return acc;
		}

		return {
			...acc,
			properties: {
				...(acc.properties || {}),
				[key]: contentType.validateSchema.properties[key],
			},
			required: contentType.validateSchema.required.includes(key)
				? [...(acc.required || []), key]
				: acc.required,
		};
	}, omit(['properties', 'required'])(contentType.validateSchema));

const validateCTCompartment = (contentType: ContentTypeSchema, settings: CtTypeSettings) => (
	values: ContentSchema
): boolean => {
	const { validationSchema, errorMessages } = getCompartmentFormProps(contentType, settings);
	const CustomValidator = getCustomValidator();

	if (validationSchema && CustomValidator) {
		const validator = new CustomValidator(validationSchema, errorMessages, {
			allErrors: true,
			messages: true,
		});

		const errors = validator.validate({
			...values.fields,
			...(settings.includeWorkingTitle ? { [WORKING_TITLE_KEY]: values.meta.label } : {}),
		}) as boolean;

		return isEmpty(errors);
	}
	// If no validationSchema is found return compartment as valid
	return true;
};

export const getContentTypeCompartments = (
	contentType: ContentTypeSchema
): ContentCompartmentModel<ModuleValue, CtTypeSettings>[] => {
	const compartments = contentType.compartments?.length
		? contentType.compartments
		: [{ uuid: 'default', label: 'Inhoud', removable: false }];

	return compartments.reduce((acc, compartment) => {
		const compartmentFields = compose<
			ContentTypeFieldSchema[],
			ContentTypeFieldSchema[],
			ContentTypeFieldSchema[]
		>(
			filter<ContentTypeFieldSchema>(
				field =>
					field.compartment?.uuid === compartment.uuid ||
					(compartment.removable === false && !field.compartment)
			),
			sort<ContentTypeFieldSchema>(field => field.compartment?.position || Number.MAX_VALUE)
		)(contentType.fields);

		if (!compartmentFields.length) {
			return acc;
		}

		const compartmentFieldNames = compartmentFields.map(field => field.name);
		const compartmentErrorMessages = getCTCompartmentErrorMessages(
			contentType,
			compartmentFieldNames
		);
		const compartmentValidateSchema = getCTCompartmentValidationSchema(
			contentType,
			compartmentFieldNames
		);
		const context = {
			fields: compartmentFields,
			validateSchema: compartmentValidateSchema,
			errorMessages: compartmentErrorMessages,
			includeWorkingTitle: acc.length === 0, // Is first compartment
		};
		const slug = kebabCase(compartment.label);

		return acc.concat([
			{
				slug,
				context,
				label: compartment.label,
				name: `fields_${slug}`,
				component: FieldsForm,
				type: CompartmentType.CT,
				isValid: false,
				validate: validateCTCompartment(contentType, context),
			},
		]);
	}, [] as ContentCompartmentModel<ModuleValue, CtTypeSettings>[]);
};

export const validateCompartments = (
	activeCompartment: ContentCompartmentModel,
	compartments: ContentCompartmentModel[],
	values: ContentSchema,
	setValidity: (id: string, isValid: boolean) => void
): boolean => {
	// Create array of booleans from compartment validation
	const validatedCompartments: boolean[] = compartments.map(compartment => {
		if (compartment.validate) {
			const isValid = compartment.validate(values, activeCompartment);
			setValidity(compartment.name, isValid);

			return isValid;
		}

		// Compartment is valid if no validate function is given
		return true;
	});

	// Return false if one of the compartments is invalid
	return !validatedCompartments.includes(false);
};

export const runAllSubmitHooks = (
	compartments: ContentCompartmentModel[],
	contentType: ContentTypeSchema,
	contentItemDraft: ContentSchema,
	contentItem: ContentSchema | undefined,
	type: 'beforeSubmit' | 'afterSubmit',
	error?: any
): Promise<{
	hasRejected: boolean;
	errorMessages: { compartmentName: string; error: Error }[];
	contentItem: ContentSchema;
}> => {
	const allPromises = compartments.reduce((acc, compartment) => {
		if (type === 'beforeSubmit' && typeof compartment.beforeSubmit === 'function') {
			acc.push(compartment.beforeSubmit(contentItemDraft, contentType, contentItem));
			return acc;
		}

		if (type === 'afterSubmit' && typeof compartment.afterSubmit === 'function') {
			acc.push(compartment.afterSubmit(error, contentItemDraft, contentType, contentItem));
			return acc;
		}

		acc.push(Promise.resolve(true));

		return acc;
	}, [] as Promise<any>[]);

	return Promise.allSettled(allPromises).then(values => {
		const allValues = values
			.filter(c => c.status === 'fulfilled')
			.map(c => {
				return c as PromiseFulfilledResult<any>;
			})
			.map(c => c.value);
		const errorMessages = values
			.map(c => c as PromiseRejectedResult)
			.reduce((acc, c, index) => {
				const compartment = compartments.find((comp, compIndex) => compIndex === index);
				if (c.status === 'rejected' && c.reason && compartment) {
					acc.push({
						compartmentName: compartment.name,
						error: c.reason,
					});
				}
				return acc;
			}, [] as { compartmentName: string; error: Error }[]);
		const hasRejected = errorMessages.length > 0;

		const newContentItemDraft = allValues.reduce(
			(newContentItem, moduleValue, index) => {
				const compartment = compartments.find((comp, compIndex) => compIndex === index);
				if (moduleValue && compartment && compartment.type === CompartmentType.MODULE) {
					return {
						...newContentItem,
						modulesData: {
							...newContentItem.modulesData,
							[compartment.name]: moduleValue,
						},
					};
				}
				return newContentItem;
			},
			{ ...contentItemDraft }
		);

		contentFacade.updateContentItemDraft(newContentItemDraft);

		return {
			hasRejected,
			errorMessages,
			contentItem: newContentItemDraft,
		};
	});
};
