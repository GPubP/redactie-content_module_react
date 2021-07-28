import { EntityState } from '@datorama/akita';
import { SiteDetailModel } from '@redactie/sites-module';
import { FC } from 'react';

import { ExternalActionProps } from '../../../views/ContentDetail/ContentDetail.types';
import { ContentModel } from '../../content';
import { ContentTypeModel } from '../../contentTypes';

export interface ExternalActionOptions {
	module: string;
	component: FC<ExternalActionProps>;
	show?: (contentType: ContentTypeModel, site: SiteDetailModel, content: ContentModel) => boolean;
	replace?: boolean; // only replace existing if this is true (safety)
}

export interface ExternalActionModel extends Omit<ExternalActionOptions, 'replace'> {
	name: string;
}

export type ExternalActionsState = EntityState<ExternalActionModel, string>;

export const createInitialExternalActionsState = (): ExternalActionsState => ({});
