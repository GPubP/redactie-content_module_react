import { Tab, TabTypes } from '../../content.types';
import { ExternalTabModel } from '../../store/api/externalTabs';

export const mapExternalTabToTab = (externalTab: ExternalTabModel): Tab => ({
	target: externalTab.name,
	name: externalTab.label,
	id: externalTab.name,
	disabled: !!externalTab.disabled,
	type: TabTypes.EXTERNAL,
	active: true,
	containerId: externalTab.containerId,
});
