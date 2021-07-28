import { useObservable } from '@mindspace-io/react';

import { ExternalActionModel, externalActionsFacade } from '../../store/api/externalActions';

const useExternalActionFacade = (): [ExternalActionModel[]] => {
	const [externalActions] = useObservable(externalActionsFacade.all$, []);

	return [externalActions];
};

export default useExternalActionFacade;
