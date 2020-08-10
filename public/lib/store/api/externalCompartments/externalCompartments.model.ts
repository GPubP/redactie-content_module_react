import { EntityState } from '@datorama/akita';
import { FC } from 'react';

import { ContentSchema, ContentTypeSchema } from '../../../api/api.types';
import { CompartmentProps } from '../../../views/ContentForm/ContentForm.types';

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

export interface ExternalCompartmentOptions {
	label: string;
	module: string;
	component: FC<CompartmentProps>;
	show?: (
		settings: ModuleSettings,
		value: ModuleValue,
		content: ContentSchema,
		contentType: ContentTypeSchema
	) => boolean | boolean;
	replace?: boolean; // only replace existing if this is true (safety)
}

export interface ExternalCompartmentModel {
	label: string;
	name: string;
	component: FC<CompartmentProps>;
	isValid?: boolean;
	validate?: (values: ContentSchema) => boolean;
	show?: (
		settings: ModuleSettings,
		value: ModuleValue,
		content: ContentSchema,
		contentType: ContentTypeSchema
	) => boolean | boolean;
	module?: string;
}

export type ExternalCompartmentsState = EntityState<ExternalCompartmentModel, string>;

export const createInitialExternalCompartmentsState = (): ExternalCompartmentsState => ({});
