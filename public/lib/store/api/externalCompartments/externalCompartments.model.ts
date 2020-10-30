import { EntityState } from '@datorama/akita';
import { FC } from 'react';

import { ContentSchema, ContentTypeSchema } from '../../../api/api.types';
import { CompartmentProps } from '../../../views/ContentForm/ContentForm.types';
import {
	ContentCompartmentAfterSubmitFn,
	ContentCompartmentBeforeSubmitFn,
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

export type ExternalCompartmentBeforeSubmitFn = ContentCompartmentBeforeSubmitFn;
export type ExternalCompartmentAfterSubmitFn = ContentCompartmentAfterSubmitFn;

export interface ExternalCompartmentOptions {
	label: string;
	getDescription?: (contentItem: ContentSchema | undefined) => string;
	module: string;
	component: FC<CompartmentProps>;
	isValid?: boolean;
	validate?: (values: ContentSchema) => boolean;
	beforeSubmit?: ExternalCompartmentBeforeSubmitFn;
	afterSubmit?: ExternalCompartmentAfterSubmitFn;
	show?: (
		settings: ModuleSettings,
		value: ModuleValue,
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
