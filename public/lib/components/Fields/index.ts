import { getFieldRegistery } from '../../connectors/formRenderer';

import { ContentSelect, ContentSelectView } from './ContentSelect';

export const registerCCFields = (): void => {
	const fieldRegistery = getFieldRegistery();

	if (fieldRegistery) {
		fieldRegistery.add([
			{
				name: 'contentReference',
				module: 'content',
				component: ContentSelect,
				viewComponent: ContentSelectView,
			},
		]);
	}
};
