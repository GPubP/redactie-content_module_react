import {
	ExternalCompartmentOptions,
	externalCompartmentsFacade,
} from '../store/api/externalCompartments';

export const registerContentDetailCompartment = (
	name: string,
	options: ExternalCompartmentOptions
): void => externalCompartmentsFacade.registerCompartment(name, options);
