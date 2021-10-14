import { useMemo } from 'react';

import { Tab } from '../../content.types';
import { mapExternalTabToTab } from '../../helpers';
import { ExternalTabModel } from '../../store/api/externalTabs';

const useActiveTabs = (tabs: Tab[], externalTabs: ExternalTabModel[], pathname: string): Tab[] => {
	const activeTabs = useMemo(() => {
		const externalMappedTabs = externalTabs.map(externalTab =>
			mapExternalTabToTab(externalTab)
		);

		return [...tabs, ...externalMappedTabs].map(tab => ({
			...tab,
			active: new RegExp(`/${tab.target}/?`).test(pathname),
		}));
	}, [externalTabs, pathname, tabs]);

	return activeTabs;
};

export default useActiveTabs;
