import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

import { ExternalCompartmentModel } from './externalCompartments.model';
import { externalCompartmentsQuery } from './externalCompartments.query';

function onEmit<T>(source$: Observable<T>, nextFn: (value: T) => void): any {
	return source$.subscribe(nextFn, console.error);
}

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
