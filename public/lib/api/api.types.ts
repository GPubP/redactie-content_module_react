import { ExternalCompartmentOptions } from '../store/api/externalCompartments';

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

export interface ContentAPI {
	registerContenDetailCompartment: (name: string, options: ExternalCompartmentOptions) => void;
}
