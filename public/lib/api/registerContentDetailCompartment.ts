import {
	ExternalCompartmentOptions,
	externalCompartmentsService,
} from '../store/api/externalCompartments';

export const registerContentDetailCompartment = (
	name: string,
	options: ExternalCompartmentOptions
): void => externalCompartmentsService.registerCompartment(name, options);
