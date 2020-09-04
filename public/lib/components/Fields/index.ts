import { getFieldRegistery } from '../../connectors/formRenderer';

import { ContentSelect } from './ContentSelect';

export const registerCCFields = (): void => {
	const fieldRegistery = getFieldRegistery();

	if (fieldRegistery) {
		fieldRegistery.add([
			{
				name: 'contentReference',
				module: 'content',
				component: ContentSelect,
			},
		]);
	}
};
