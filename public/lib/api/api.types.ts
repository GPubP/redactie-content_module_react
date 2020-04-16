import { ExternalCompartmentOptions } from '../store/externalCompartments';

export {
	ExternalCompartmentProps,
	ModuleSettings,
	ModuleValue,
} from '../store/externalCompartments/externalCompartments.model';
export { ContentSchema } from '../services/content/content.service.types';
export {
	ContentTypeSchema,
	ContentTypeFieldSchema,
} from '../services/contentTypes/contentTypes.service.types';

export interface ContentAPI {
	registerContenDetailCompartment: (name: string, options: ExternalCompartmentOptions) => void;
}
