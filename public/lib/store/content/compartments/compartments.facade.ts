import { ID } from '@datorama/akita';
import { useEffect, useState } from 'react';

import { onEmit } from '../../../helpers/onEmit';

import { ContentCompartmentModel, ContentCompartmentRegisterOptions } from './compartments.model';
import { contentCompartmentsQuery } from './compartments.query';
import { contentCompartmentsService } from './compartments.service';

interface CompartmentState {
	compartments: ContentCompartmentModel[];
	active: ContentCompartmentModel[];
}

export const useCompartmentFacade = (): [
	CompartmentState,
	(compartments: ContentCompartmentModel[], options: ContentCompartmentRegisterOptions) => void,
	(names: ID[]) => void
] => {
	const register = (
		compartments: ContentCompartmentModel[] | ContentCompartmentModel,
		options: { replace?: true }
	): void => contentCompartmentsService.register(compartments, options);
	const activate = (names: ID[]): void => contentCompartmentsService.setActive(names);
	const [compartments, setCompartments] = useState<ContentCompartmentModel[]>([]);
	const [active, setActive] = useState<ContentCompartmentModel[]>([]);

	useEffect(() => {
		const subscriptions: any[] = [
			onEmit<ContentCompartmentModel[]>(contentCompartmentsQuery.all$, all =>
				setCompartments(all)
			),
			onEmit<ContentCompartmentModel[]>(
				contentCompartmentsQuery.active$,
				(active: ContentCompartmentModel[]) => setActive(active)
			),
		];

		return () => {
			subscriptions.map(it => it.unsubscribe());
		};
	}, []);

	return [{ compartments, active }, register, activate];
};
