import { ALERT_CONTAINER_IDS, Tab, TabTypes } from '../../content.types';

export const CONTENT_UPDATE_TAB_MAP: {
	[key in 'view' | 'edit']: Tab;
} = {
	view: {
		name: 'Bekijk',
		target: 'bekijk',
		active: true,
		disabled: false,
		type: TabTypes.INTERNAL,
		containerId: ALERT_CONTAINER_IDS.contentEdit,
	},
	edit: {
		name: 'Bewerk',
		target: 'bewerk',
		active: false,
		disabled: false,
		type: TabTypes.INTERNAL,
		containerId: ALERT_CONTAINER_IDS.contentEdit,
	},
};

export const CONTENT_UPDATE_TABS: Tab[] = [
	CONTENT_UPDATE_TAB_MAP.view,
	CONTENT_UPDATE_TAB_MAP.edit,
];
