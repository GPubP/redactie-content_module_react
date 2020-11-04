import { EntityState } from '@datorama/akita';
import { FC } from 'react';

import { ContentSchema, ContentTypeSchema } from '../../../api/api.types';
import { CompartmentProps } from '../../../views/ContentForm/ContentForm.types';
import {
	ContentCompartmentAfterSubmitFn,
	ContentCompartmentBeforeSubmitFn,
	ContentCompartmentModel,
} from '../../ui/contentCompartments';

export type ModuleValue = any;

export interface ModuleSettings {
	uuid: string;
	label: string;
	name: string;
	module?: string;
	config: {
		[key: string]: any;
	};
	validationSchema?: {
		[key: string]: any;
	};
}

export type ExternalCompartmentBeforeSubmitFn<M = ModuleValue> = ContentCompartmentBeforeSubmitFn<
	M
>;
export type ExternalCompartmentAfterSubmitFn<M = ModuleValue> = ContentCompartmentAfterSubmitFn<M>;

export interface ExternalCompartmentOptions<M = ModuleValue> {
	label: string;
	getDescription?: (contentItem: ContentSchema | undefined) => string;
	module: string;
	component: FC<CompartmentProps<M>>;
	isValid?: boolean;
	validate?: (values: ContentSchema, activeCompartment: ContentCompartmentModel) => boolean;
	beforeSubmit?: ExternalCompartmentBeforeSubmitFn<M>;
	afterSubmit?: ExternalCompartmentAfterSubmitFn<M>;
	show?: (
		settings: ModuleSettings,
		value: M,
		content: ContentSchema,
		contentType: ContentTypeSchema
	) => boolean | boolean;
	replace?: boolean; // only replace existing if this is true (safety)
}

export interface ExternalCompartmentModel extends Omit<ExternalCompartmentOptions, 'replace'> {
	name: string;
}

export type ExternalCompartmentsState = EntityState<ExternalCompartmentModel, string>;

export const createInitialExternalCompartmentsState = (): ExternalCompartmentsState => ({});
