import { ID } from '@datorama/akita';
import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

import { ContentCompartmentModel, ContentCompartmentRegisterOptions } from './compartments.model';
import { contentCompartmentsQuery } from './compartments.query';
import { contentCompartmentsService } from './compartments.service';

interface CompartmentState {
	compartments: ContentCompartmentModel[];
	active: ContentCompartmentModel | undefined;
}

function onEmit<T>(source$: Observable<T>, nextFn: (value: T) => void): any {
	return source$.subscribe(nextFn, console.error);
}

export const useCompartmentFacade = (): [
	CompartmentState,
	(compartments: ContentCompartmentModel[], options: ContentCompartmentRegisterOptions) => void,
	(names: ID) => void
] => {
	const register = (
		compartments: ContentCompartmentModel[] | ContentCompartmentModel,
		options: { replace?: true }
	): void => contentCompartmentsService.register(compartments, options);
	const activate = (name: ID): void => contentCompartmentsService.setActive(name);
	const [compartments, setCompartments] = useState<ContentCompartmentModel[]>([]);
	const [active, setActive] = useState<ContentCompartmentModel>();

	useEffect(() => {
		const subscriptions: any[] = [
			onEmit<ContentCompartmentModel[]>(contentCompartmentsQuery.all$, all =>
				setCompartments(all)
			),
			onEmit<ContentCompartmentModel>(
				contentCompartmentsQuery.active$,
				(active: ContentCompartmentModel) => setActive(active)
			),
		];

		return () => {
			subscriptions.map(it => it.unsubscribe());
		};
	}, []);

	return [{ compartments, active }, register, activate];
};
