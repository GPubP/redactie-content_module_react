import { ExternalTabOptions, externalTabsService } from '../store/api/externalTabs';

export const registerContentDetailTab = (name: string, options: ExternalTabOptions): void =>
	externalTabsService.registerTabs(name, options);
