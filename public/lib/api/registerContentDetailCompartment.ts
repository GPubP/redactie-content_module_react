import {
	ExternalCompartmentOptions,
	externalCompartmentsService,
} from '../store/api/externalCompartments';

export const registerContenDetailCompartment = (
	name: string,
	options: ExternalCompartmentOptions
): void => externalCompartmentsService.registerCompartment(name, options);
