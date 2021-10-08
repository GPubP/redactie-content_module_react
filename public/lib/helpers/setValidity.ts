import { ContentCompartmentModel } from '../store/ui/contentCompartments';

export const setValidity = (
	currentCompartments: ContentCompartmentModel[],
	compartment: ContentCompartmentModel[]
): ContentCompartmentModel[] => {
	return compartment.map(compartment => ({
		...compartment,
		isValid:
			currentCompartments.find(c => c.name === compartment.name)?.isValid ??
			compartment.isValid,
	}));
};
