import { Context } from 'react';

import { TenantContextValue } from '../context';
import { ModuleValue } from '../services/content';
import {
	ExternalCompartmentAfterSubmitFn,
	ExternalCompartmentBeforeSubmitFn,
	ExternalCompartmentOptions,
} from '../store/api/externalCompartments';

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
	ExternalCompartmentOptions,
	ExternalCompartmentAfterSubmitFn,
	ExternalCompartmentBeforeSubmitFn,
};
export interface ContentAPI {
	registerContentDetailCompartment: <M = ModuleValue>(
		name: string,
		options: ExternalCompartmentOptions<M>
	) => void;
	contentTenantContext: Context<TenantContextValue>;
}
