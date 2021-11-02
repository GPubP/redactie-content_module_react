import { ActiveState, EntityState } from '@datorama/akita';
import { SiteDetailModel } from '@redactie/sites-module';
import { FC } from 'react';

import { ContentSchema, ContentTypeSchema, ModuleSettings } from '../../../api/api.types';
import { CompartmentProps, CtTypeSettings } from '../../../views/ContentForm/ContentForm.types';

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
	contentItem: ContentSchema | undefined,
	site?: SiteDetailModel
) => Promise<M | void>;

export interface ResponseError {
	response: Response;
}

export type ContentCompartmentAfterSubmitFn<M = ModuleValue> = (
	error: Error | ResponseError | undefined,
	contentItemDraft: ContentSchema,
	contentType: ContentTypeSchema,
	contentItem: ContentSchema | undefined,
	site?: SiteDetailModel
) => Promise<M | void>;

export interface ContentCompartmentsValidateOptions {
	async: boolean;
	allowedTransitions: string[];
}

export interface ContentCompartmentModel<
	M = ModuleValue,
	S = ModuleSettings | CtTypeSettings | ContentTypeSchema | undefined
> {
	name: string;
	label: string;
	getDescription?: (contentItem: ContentSchema | undefined) => string | undefined;
	slug?: string;
	component: FC<CompartmentProps<M, S>>;
	type: CompartmentType;
	isValid?: boolean;
	context?: Record<string, any>;
	validate?: (
		values: ContentSchema,
		activeCompartment: ContentCompartmentModel,
		options: ContentCompartmentsValidateOptions
	) => Promise<boolean> | boolean;
	beforeSubmit?: ContentCompartmentBeforeSubmitFn<M>;
	afterSubmit?: ContentCompartmentAfterSubmitFn<M>;
}

export interface ContentCompartmentState
	extends EntityState<ContentCompartmentModel, string>,
		ActiveState {}

export const createInitialContentCompartmentState = (): ContentCompartmentState => ({
	active: null,
});
