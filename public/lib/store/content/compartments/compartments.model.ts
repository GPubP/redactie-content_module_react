import { EntityState, MultiActiveState } from '@datorama/akita';

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
	type: CompartmentType;
}

export interface ContentCompartmentState
	extends EntityState<ContentCompartmentModel, string>,
		MultiActiveState {}

export const createInitialContentCompartmentState = (): ContentCompartmentState => ({
	active: [],
});
