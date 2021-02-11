import { ID } from '@datorama/akita';
import { useObservable } from '@mindspace-io/react';

import {
	ContentCompartmentModel,
	ContentCompartmentRegisterOptions,
	contentCompartmentsFacade,
} from '../../store/ui/contentCompartments';

interface CompartmentState {
	compartments: ContentCompartmentModel[];
	active: ContentCompartmentModel | undefined;
}

const useContentCompartmentFacade = (): [
	CompartmentState,
	(compartments: ContentCompartmentModel[], options: ContentCompartmentRegisterOptions) => void,
	(names: ID) => void,
	(name: string, isValid: boolean) => void,
	(isValid: boolean) => void
] => {
	const register = (
		compartments: ContentCompartmentModel[] | ContentCompartmentModel,
		options: { replace?: true }
	): void => contentCompartmentsFacade.register(compartments, options);
	const activate = (name: ID): void => contentCompartmentsFacade.setActiveByNamOrSlug(name);
	const validate = (name: string, isValid: boolean): void =>
		contentCompartmentsFacade.setValid(name, isValid);
	const setActiveIsValid = (isValid: boolean): void =>
		contentCompartmentsFacade.setActiveIsValid(isValid);

	const [compartments] = useObservable(contentCompartmentsFacade.all$, []);
	const [active] = useObservable(contentCompartmentsFacade.active$);

	return [{ compartments, active }, register, activate, validate, setActiveIsValid];
};

export default useContentCompartmentFacade;
