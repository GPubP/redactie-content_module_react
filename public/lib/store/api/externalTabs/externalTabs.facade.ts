import { ID } from '@datorama/akita';
import { useEffect, useState } from 'react';

import { onEmit } from '../../../helpers';

import { ExternalTabModel } from './externalTabs.model';
import { externalTabsQuery } from './externalTabs.query';
import { externalTabsService, ExternalTabsService } from './externalTabs.service';

export const useExternalTabsFacade = (): [
	{ all: ExternalTabModel[]; active: ExternalTabModel | null },
	ExternalTabsService['activate']
] => {
	const activate = (name: ID): void => externalTabsService.activate(name);

	const [all, setTabs] = useState<ExternalTabModel[]>([]);
	const [active, setActive] = useState<ExternalTabModel | null>(null);

	useEffect(() => {
		const subscriptions: any[] = [
			onEmit<ExternalTabModel[]>(externalTabsQuery.all$, all => setTabs(all)),
			onEmit<ExternalTabModel>(externalTabsQuery.active$, active => setActive(active)),
		];

		return () => {
			subscriptions.map(it => it.unsubscribe());
		};
	}, [setActive]);

	return [{ all, active }, activate];
};
