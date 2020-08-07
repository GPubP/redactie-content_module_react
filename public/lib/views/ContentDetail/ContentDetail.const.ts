import { Tab } from '../../content.types';

export const CONTENT_UPDATE_TAB_MAP: {
	[key in 'view' | 'edit']: Tab;
} = {
	view: {
		name: 'Bekijk',
		target: 'bekijk',
		active: true,
	},
	edit: {
		name: 'Bewerk',
		target: 'bewerk',
		active: false,
	},
};

export const CONTENT_UPDATE_TABS: Tab[] = [
	CONTENT_UPDATE_TAB_MAP.view,
	CONTENT_UPDATE_TAB_MAP.edit,
];
