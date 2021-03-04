import { FC } from 'react';

import { getFieldRegistery } from '../../connectors/formRenderer';

import { Anchorlink } from './Anchorlink';
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
			{
				name: 'ankerlink',
				// Moved from content-types module
				module: 'content-types',
				// Typing of react-form-renderer expects a string but this returns an Anchorlink object
				component: Anchorlink as FC<any>,
			},
		]);
	}
};
