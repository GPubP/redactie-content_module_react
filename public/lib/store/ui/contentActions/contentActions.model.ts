import { EntityState } from '@datorama/akita';
import { FC } from 'react';

export interface ContentActionRegisterOptions {
	replace?: true;
}

export interface ContentActionModel {
	component: FC<any>;
}

export type ContentActionsState = EntityState<ContentActionModel, string>;

export const createInitialContentActionsState = (): ContentActionsState => ({});
