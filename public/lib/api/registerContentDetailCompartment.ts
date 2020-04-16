import {
	ExternalCompartmentOptions,
	externalCompartmentsService,
} from '../store/externalCompartments';

export const registerContenDetailCompartment = (
	name: string,
	options: ExternalCompartmentOptions
): void => externalCompartmentsService.registerCompartment(name, options);
