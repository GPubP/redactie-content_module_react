import { ID } from '@datorama/akita';
import { useEffect, useState } from 'react';

import { onEmit } from '../../../helpers/onEmit';

import { ContentInternalModel } from './internal.model';
import { contentInternalQuery } from './internal.query';
import { contentInternalService } from './internal.service';

interface InternalState {
	content: ContentInternalModel[];
	active: ContentInternalModel | undefined;
}

export const useInternalFacade = (): [
	InternalState,
	(content: ContentInternalModel[]) => void,
	(names: ID) => void
] => {
	const register = (content: ContentInternalModel[]): void =>
		contentInternalService.register(content);
	const activate = (name: ID): void => contentInternalService.setActive(name);
	const [content, setContent] = useState<ContentInternalModel[]>([]);
	const [active, setActive] = useState<ContentInternalModel>();

	useEffect(() => {
		const subscriptions: any[] = [
			onEmit<ContentInternalModel[]>(contentInternalQuery.all$, all => setContent(all)),
			onEmit<ContentInternalModel>(
				contentInternalQuery.active$,
				(active: ContentInternalModel) => setActive(active)
			),
		];

		return () => {
			subscriptions.map(it => it.unsubscribe());
		};
	}, []);

	return [{ content, active }, register, activate];
};
