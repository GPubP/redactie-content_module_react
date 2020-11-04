import { ActiveState, EntityState } from '@datorama/akita';
import { FC } from 'react';

import { ContentSchema, ContentTypeSchema } from '../../../api/api.types';
import { CompartmentProps } from '../../../views/ContentForm/ContentForm.types';

export type ModuleValue = any;
export enum CompartmentType {
	'CT',
	'INTERNAL',
	'MODULE',
}

export interface ContentCompartmentRegisterOptions {
	replace?: true;
}

export type ContentCompartmentBeforeSubmitFn = (
	activeCompartmentName: string,
	moduleValue: ModuleValue,
	contentItem: ContentSchema,
	contentType: ContentTypeSchema,
	isCreating: boolean
) => Promise<boolean>;

export type ContentCompartmentAfterSubmitFn = (
	error: Error | undefined,
	activeCompartmentName: string,
	moduleValue: ModuleValue,
	contentItem: ContentSchema,
	contentType: ContentTypeSchema,
	isCreating: boolean
) => Promise<boolean>;

export interface ContentCompartmentModel {
	name: string;
	label: string;
	getDescription?: (contentItem: ContentSchema | undefined) => string | undefined;
	slug?: string;
	component: FC<CompartmentProps>;
	type: CompartmentType;
	isValid?: boolean;
	validate?: (values: ContentSchema, activeCompartment: ContentCompartmentModel) => boolean;
	beforeSubmit?: ContentCompartmentBeforeSubmitFn;
	afterSubmit?: ContentCompartmentAfterSubmitFn;
}

export interface ContentCompartmentState
	extends EntityState<ContentCompartmentModel, string>,
		ActiveState {}

export const createInitialContentCompartmentState = (): ContentCompartmentState => ({
	active: null,
});
