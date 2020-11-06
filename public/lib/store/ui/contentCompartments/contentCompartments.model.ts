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

export type ContentCompartmentBeforeSubmitFn<M = ModuleValue> = (
	contentItemDraft: ContentSchema,
	contentType: ContentTypeSchema,
	contentItem: ContentSchema | undefined
) => Promise<M | void>;

export type ContentCompartmentAfterSubmitFn<M = ModuleValue> = (
	error: Error | undefined,
	contentItemDraft: ContentSchema,
	contentType: ContentTypeSchema,
	contentItem: ContentSchema | undefined
) => Promise<M | void>;

export interface ContentCompartmentModel<M = ModuleValue> {
	name: string;
	label: string;
	getDescription?: (contentItem: ContentSchema | undefined) => string | undefined;
	slug?: string;
	component: FC<CompartmentProps>;
	type: CompartmentType;
	isValid?: boolean;
	validate?: (values: ContentSchema, activeCompartment: ContentCompartmentModel) => boolean;
	beforeSubmit?: ContentCompartmentBeforeSubmitFn<M>;
	afterSubmit?: ContentCompartmentAfterSubmitFn<M>;
}

export interface ContentCompartmentState
	extends EntityState<ContentCompartmentModel, string>,
		ActiveState {}

export const createInitialContentCompartmentState = (): ContentCompartmentState => ({
	active: null,
});
