import { EntityState } from '@datorama/akita';
import { FC } from 'react';

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
	replace?: boolean; // only replace existing if this is true (safety)
}

export interface ExternalCompartmentModel {
	label: string;
	name: string;
	component: FC<CompartmentProps>;
	module?: string;
}

export type ExternalCompartmentsState = EntityState<ExternalCompartmentModel, string>;

export const createInitialExternalCompartmentsState = (): ExternalCompartmentsState => ({});
