import { getFieldRegistery } from '../../connectors/formRenderer';

import { ContentSelect } from './ContentSelect';

export const registerCCFields = (): void => {
	const fieldRegistry = getFieldRegistery();

	if (fieldRegistry) {
		fieldRegistry.add([
			{
				name: 'contentReference',
				module: 'content',
				component: ContentSelect,
			},
		]);
	}
};
