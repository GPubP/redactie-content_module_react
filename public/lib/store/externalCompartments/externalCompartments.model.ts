import { EntityState } from '@datorama/akita';
import { FormikErrors } from 'formik';
import { FC } from 'react';

import { ContentsSchema } from '../../services/content';
import { ContentTypeSchema } from '../../services/contentTypes';

export type ModuleValue = any;

export interface ModuleSettings {
	uuid: string;
	label: string;
	name: string;
	module?: string;
	config: any;
	validationSchema?: any;
}

export interface ExternalCompartmentProps {
	contentType: ContentTypeSchema; // = deep clone
	contentVaue: ContentsSchema; // = deep clone
	settings: ModuleSettings; // = deep clone
	value: ModuleValue; // module data section
	isValid: boolean;

	onChange: (e: ModuleValue) => FormikErrors<any>[] | null; // Boolean for validation result (maybe?)
	updateContent: (e: ContentsSchema) => FormikErrors<any>[] | null; // For edge cases where content item must be changed. Boolean for validation
}

export interface ExternalCompartmentOptions {
	label: string;
	module: string;
	component: FC<ExternalCompartmentProps>;
	replace?: boolean; // only replace existing if this is true (safety)
}

export interface ExternalCompartmentModel {
	label: string;
	name: string;
	component: FC<ExternalCompartmentProps>;
	module?: string;
}

export type ExternalCompartmentsState = EntityState<ExternalCompartmentModel, string>;

export const createInitialExternalCompartmentsState = (): ExternalCompartmentsState => ({});
