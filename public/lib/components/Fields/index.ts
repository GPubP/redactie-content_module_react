import { FC } from 'react';

import formRendererConnector from '../../connectors/formRenderer';

import { Anchorlink } from './Anchorlink';
import { ContentSelect } from './ContentSelect';
import { CrossSiteContentSelect } from './CrossSiteContentSelect';

export const registerCCFields = (): void => {
	const fieldRegistry = formRendererConnector.api.fieldRegistry;

	if (fieldRegistry) {
		fieldRegistry.add([
			{
				name: 'contentReference',
				module: 'content',
				component: ContentSelect,
			},
			{
				name: 'crossSiteContentReference',
				module: 'content',
				// Typing of react-form-renderer expects a string but this returns an CrossSiteContentSelect object
				component: CrossSiteContentSelect as FC<any>,
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
