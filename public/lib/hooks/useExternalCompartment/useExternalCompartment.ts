import { useObservable } from '@mindspace-io/react';

import {
	ExternalCompartmentModel,
	externalCompartmentsFacade,
} from '../../store/api/externalCompartments';

const useExternalCompartmentFacade = (): [ExternalCompartmentModel[]] => {
	const [externalCompartments] = useObservable(externalCompartmentsFacade.all$, []);

	return [externalCompartments];
};

export default useExternalCompartmentFacade;
