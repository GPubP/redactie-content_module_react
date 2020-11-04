import { ModuleValue } from '../services/content';
import {
	ExternalCompartmentOptions,
	externalCompartmentsFacade,
} from '../store/api/externalCompartments';

export const registerContentDetailCompartment = <M = ModuleValue>(
	name: string,
	options: ExternalCompartmentOptions<M>
): void => externalCompartmentsFacade.registerCompartment(name, options);
