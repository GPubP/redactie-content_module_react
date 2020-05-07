import { useEffect, useState } from 'react';

import { onEmit } from '../../../helpers';

import { ExternalCompartmentModel } from './externalCompartments.model';
import { externalCompartmentsQuery } from './externalCompartments.query';

export const useExternalCompartmentFacade = (): [ExternalCompartmentModel[]] => {
	const [externalCompartments, setCompartments] = useState<ExternalCompartmentModel[]>([]);

	useEffect(() => {
		const subscriptions: any[] = [
			onEmit<ExternalCompartmentModel[]>(externalCompartmentsQuery.all$, all =>
				setCompartments(all)
			),
		];

		return () => {
			subscriptions.map(it => it.unsubscribe());
		};
	}, []);

	return [externalCompartments];
};
