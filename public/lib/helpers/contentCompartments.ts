import { always, clone, compose, find, identity, ifElse, pick } from 'ramda';

import {
	CompartmentProps,
	ContentSchema,
	ContentTypeSchema,
	ModuleSettings,
} from '../api/api.types';
import { WORKING_TITLE_KEY } from '../content.const';
import { ExternalCompartmentModel } from '../store/api/externalCompartments';
import { CompartmentType, ContentCompartmentModel } from '../store/ui/contentCompartments';

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
			return contentType?.fields;
		case CompartmentType.INTERNAL:
			return contentType;
		case CompartmentType.MODULE:
			return compose(
				clone,
				pick(['config', 'validationSchema']) as any,
				ifElse(identity, identity, always({})),
				find((moduleConfig: ModuleSettings) => moduleConfig.name === compartment.name)
			)(contentType.modulesConfig || []) as CompartmentProps['settings'];
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
				...getInitialContentValues(contentType, content?.fields),
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

export const filterCompartments = (
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
	activeCompartment: ContentCompartmentModel,
	compartments: ContentCompartmentModel[],
	contentType: ContentTypeSchema,
	contentItem: ContentSchema,
	isCreating: boolean,
	type: 'beforeSubmit' | 'afterSubmit',
	error?: any
): Promise<{
	hasRejected: boolean;
	errorMessages: { compartmentName: string; error: Error }[];
	contentItem: ContentSchema;
}> => {
	const allPromises = compartments.reduce((acc, compartment) => {
		if (type === 'beforeSubmit' && typeof compartment.beforeSubmit === 'function') {
			acc.push(
				compartment.beforeSubmit(
					activeCompartment.name,
					getCompartmentValue(contentItem, activeCompartment, contentType),
					contentItem,
					contentType,
					isCreating
				)
			);
			return acc;
		}

		if (type === 'afterSubmit' && typeof compartment.afterSubmit === 'function') {
			acc.push(
				compartment.afterSubmit(
					error,
					activeCompartment.name,
					getCompartmentValue(contentItem, activeCompartment, contentType),
					contentItem,
					contentType,
					isCreating
				)
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

		const newContentItem =
			!hasRejected && type === 'beforeSubmit'
				? allValues.reduce(
						(newContentItem, moduleValue, index) => {
							const compartment = compartments.find(
								(comp, compIndex) => compIndex === index
							);
							if (
								moduleValue &&
								compartment &&
								compartment.type === CompartmentType.MODULE
							) {
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
						{ ...contentItem }
				  )
				: contentItem;

		return {
			hasRejected,
			errorMessages,
			contentItem: newContentItem,
		};
	});
};
