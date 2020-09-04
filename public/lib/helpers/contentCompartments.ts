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
	compartments: ContentCompartmentModel[],
	values: ContentSchema,
	setValidity: (id: string, isValid: boolean) => void
): boolean => {
	// Create array of booleans from compartment validation
	const validatedCompartments: boolean[] = compartments.map(compartment => {
		if (compartment.validate) {
			const isValid = compartment.validate(values);
			setValidity(compartment.name, isValid);

			return isValid;
		}

		// Compartment is valid if no validate function is given
		return true;
	});

	// Return false if one of the compartments is invalid
	return !validatedCompartments.includes(false);
};
