import { Context } from 'react';

import { TenantContextValue } from '../context';
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
export { ContentSchema } from '../services/content/content.service.types';
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
	registerContentDetailCompartment: (name: string, options: ExternalCompartmentOptions) => void;
	contentTenantContext: Context<TenantContextValue>;
}
