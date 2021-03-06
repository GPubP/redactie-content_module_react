import { ContentTypeFieldSchema } from '@redactie/form-renderer-module';
import { SiteDetailModel } from '@redactie/sites-module';
import kebabCase from 'lodash.kebabcase';
import {
	always,
	assocPath,
	clone,
	compose,
	equals,
	find,
	identity,
	ifElse,
	isEmpty,
	omit,
	pathOr,
	pick,
} from 'ramda';

import {
	CompartmentProps,
	ContentSchema,
	ContentTypeSchema,
	ModuleSettings,
} from '../api/api.types';
import { FieldsForm } from '../components';
import formRendererConnector from '../connectors/formRenderer';
import { WORKING_TITLE_KEY } from '../content.const';
import { MapValueToContentItemPath } from '../services/contentTypes';
import { ExternalCompartmentModel } from '../store/api/externalCompartments';
import { contentFacade } from '../store/content';
import {
	CompartmentType,
	ContentCompartmentModel,
	ContentCompartmentsValidateOptions,
	ModuleValue,
} from '../store/ui/contentCompartments';
import { CtTypeSettings } from '../views/ContentForm/ContentForm.types';

import { contentTypeHelpers } from './contentType';
import { getCompartmentFormProps } from './getCompartmentFormProps';
import { getInitialContentValues } from './getInitialContentValues';
export const getSettings = (
	contentType: ContentTypeSchema,
	compartment: ContentCompartmentModel,
	content?: ContentSchema | undefined
): CompartmentProps['settings'] => {
	if (!contentType) {
		return;
	}

	switch (compartment.type) {
		case CompartmentType.CT:
			return compartment.context as CtTypeSettings;
		case CompartmentType.INTERNAL:
			return contentType;
		case CompartmentType.MODULE: {
			const settings = compose<
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

			return content?.meta?.site
				? assocPath(['config', 'siteUuid'], content?.meta?.site, settings)
				: settings;
		}
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
				...getInitialContentValues(
					contentType?.fields,
					content?.fields,
					content?.meta.lang
				),
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
	externalCompartments: ExternalCompartmentModel[],
	isCreating: boolean,
	site: SiteDetailModel
): ContentCompartmentModel[] => {
	const context = {
		isCreating,
	};
	return externalCompartments.reduce(
		(acc: ContentCompartmentModel[], ec): ContentCompartmentModel[] => {
			const contentCompartment = mapExternalCompartmentToContentCompartment(ec);

			if (
				content &&
				typeof ec.show === 'function' &&
				!ec.show(
					context,
					getSettings(contentType, contentCompartment, content) as ModuleSettings,
					getCompartmentValue(content, contentCompartment, contentType),
					content,
					contentType,
					site
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
): ContentTypeSchema['validateSchema'] => {
	if (!contentType.errorMessages) {
		return {};
	}

	return Object.keys(contentType.errorMessages).reduce((acc, key) => {
		if (!compartmentFieldNames.find(fieldName => key.startsWith(fieldName))) {
			return acc;
		}

		return {
			...acc,
			[key]: contentType.errorMessages[key],
		};
	}, {});
};

const getCTCompartmentValidationSchema = (
	contentType: ContentTypeSchema,
	compartmentFieldNames: string[]
): ContentTypeSchema['validateSchema'] => {
	if (!contentType.validateSchema?.properties) {
		return contentType.validateSchema;
	}

	return Object.keys(contentType.validateSchema.properties).reduce((acc, key) => {
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
};

const validateCTCompartment = (contentType: ContentTypeSchema, settings: CtTypeSettings) => (
	values: ContentSchema
): boolean => {
	const { validationSchema, errorMessages } = getCompartmentFormProps(
		contentType,
		settings,
		values.meta.lang
	);
	const CustomValidator = (formRendererConnector.api as any).CustomValidator;

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

export const getWorkTitleMapper = (
	contentType: ContentTypeSchema
): { field: ContentTypeFieldSchema; mapper: MapValueToContentItemPath } | null => {
	return contentType.fields.reduce((acc, field) => {
		if (acc) {
			return acc;
		}

		const mapValueToContentItemPath = pathOr(
			pathOr([], ['fieldType', 'data', 'generalConfig', 'mapValueToContentItemPath'])(field),
			['preset', 'data', 'generalConfig', 'mapValueToContentItemPath']
		)(field);
		const mapper = mapValueToContentItemPath.find((fieldMapper: MapValueToContentItemPath) =>
			equals(fieldMapper.destPath, ['meta', 'label'])
		);

		return mapper
			? {
					field,
					mapper,
			  }
			: null;
	}, null as { field: ContentTypeFieldSchema; mapper: MapValueToContentItemPath } | null);
};

export const getContentTypeCompartments = (
	contentType: ContentTypeSchema
): ContentCompartmentModel<ModuleValue, CtTypeSettings>[] => {
	const compartments = contentTypeHelpers.getCompartments(contentType);

	const allFields = contentTypeHelpers.getFieldsByCompartments(contentType.fields, compartments);
	const valueSyncMap = formRendererConnector.api.getValueSyncMap(allFields);

	return compartments.reduce((acc, compartment) => {
		const compartmentFields = contentTypeHelpers.getFieldsByCompartment(
			contentType.fields,
			compartment
		);
		const slug = kebabCase(compartment.label);
		const defaultCompartment = {
			slug,
			label: compartment.label,
			name: `fields_${slug}`,
			context: {
				valueSyncMap,
				fields: compartmentFields,
				validateSchema: getCTCompartmentErrorMessages(contentType, []),
				errorMessages: getCTCompartmentValidationSchema(contentType, []),
				includeWorkingTitle: !getWorkTitleMapper(contentType),
			},
			component: FieldsForm,
			type: CompartmentType.CT,
			isValid: false,
		};

		if (!compartmentFields.length) {
			// Always show working title field
			return acc.concat([
				{
					...defaultCompartment,
					validate: validateCTCompartment(contentType, defaultCompartment.context),
				},
			]);
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
			valueSyncMap,
			fields: compartmentFields,
			validateSchema: compartmentValidateSchema,
			errorMessages: compartmentErrorMessages,
			includeWorkingTitle: defaultCompartment.context.includeWorkingTitle && acc.length === 0, // Is first compartment
		};

		return acc.concat([
			{
				...defaultCompartment,
				context,
				validate: validateCTCompartment(contentType, context),
			},
		]);
	}, [] as ContentCompartmentModel<ModuleValue, CtTypeSettings>[]);
};

export const validateCompartments = async (
	activeCompartment: ContentCompartmentModel,
	compartments: ContentCompartmentModel[],
	values: ContentSchema,
	setValidity: (id: string, isValid: boolean) => void,
	options: ContentCompartmentsValidateOptions = { async: true, allowedTransitions: [] }
): Promise<boolean> => {
	// Create array of booleans from compartment validation
	const validatedCompartments: boolean[] = await Promise.all(
		compartments.map(async compartment => {
			if (compartment.validate) {
				const isValid = await compartment.validate(values, activeCompartment, options);
				setValidity(compartment.name, isValid);

				return isValid;
			}

			// Compartment is valid if no validate function is given
			return true;
		})
	);

	// Return false if one of the compartments is invalid
	return !validatedCompartments.includes(false);
};

export const runAllSubmitHooks = (
	compartments: ContentCompartmentModel[],
	contentType: ContentTypeSchema,
	contentItemDraft: ContentSchema,
	contentItem: ContentSchema | undefined,
	site: SiteDetailModel | undefined,
	type: 'beforeSubmit' | 'afterSubmit',
	error?: any
): Promise<{
	hasRejected: boolean;
	errorMessages: { compartmentName: string; error: Error }[];
	contentItem: ContentSchema;
}> => {
	const allPromises = compartments.reduce((acc, compartment) => {
		if (type === 'beforeSubmit' && typeof compartment.beforeSubmit === 'function') {
			acc.push(compartment.beforeSubmit(contentItemDraft, contentType, contentItem, site));
			return acc;
		}

		if (type === 'afterSubmit' && typeof compartment.afterSubmit === 'function') {
			acc.push(
				compartment.afterSubmit(error, contentItemDraft, contentType, contentItem, site)
			);
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
