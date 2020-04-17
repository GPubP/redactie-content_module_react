import { ActiveState, EntityState } from '@datorama/akita';
import { FC } from 'react';

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

export interface ContentCompartmentModel {
	name: string;
	label: string;
	slug?: string;
	component: FC<CompartmentProps>;
	type: CompartmentType;
}

export interface ContentCompartmentState
	extends EntityState<ContentCompartmentModel, string>,
		ActiveState {}

export const createInitialContentCompartmentState = (): ContentCompartmentState => ({
	active: null,
});
