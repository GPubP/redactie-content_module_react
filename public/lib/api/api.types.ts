import { TenantContextValue } from '@redactie/utils';
import { Context } from 'react';

import { CONTENT_STATUS_API_MAP, ModuleValue } from '../services/content';
import { ExternalActionOptions } from '../store/api/externalActions';
import {
	ExternalCompartmentAfterSubmitFn,
	ExternalCompartmentBeforeSubmitFn,
	ExternalCompartmentOptions,
} from '../store/api/externalCompartments';
import { ExternalTabOptions } from '../store/api/externalTabs';
import { ContentModel } from '../store/content';
import { ContentTypeModel } from '../store/contentTypes';
import { ExternalActionProps } from '../views/ContentDetail/ContentDetail.types';
import { ExternalTabProps } from '../views/ContentDetailExternal/ContentDetailExternal.types';

import { registerContentDetailTab } from './registerContentDetailTab';
export { CompartmentProps } from '../views/ContentForm/ContentForm.types';
export {
	ModuleSettings,
	ModuleValue,
} from '../store/api/externalCompartments/externalCompartments.model';
export { ContentSchema, ContentStatus } from '../services/content/content.service.types';
export {
	ContentTypeSchema,
	ContentTypeFieldSchema,
} from '../services/contentTypes/contentTypes.service.types';

export {
	ContentModel,
	ContentTypeModel,
	ExternalActionOptions,
	ExternalActionProps,
	ExternalCompartmentOptions,
	ExternalCompartmentAfterSubmitFn,
	ExternalCompartmentBeforeSubmitFn,
	CONTENT_STATUS_API_MAP,
	ExternalTabProps,
	ExternalTabOptions,
};
export interface ContentAPI {
	registerContentDetailCompartment: <M = ModuleValue>(
		name: string,
		options: ExternalCompartmentOptions<M>
	) => void;
	registerContentDetailAction: (name: string, options: ExternalActionOptions) => void;
	registerContentDetailTab: typeof registerContentDetailTab;
	contentTenantContext: Context<TenantContextValue>;
}
