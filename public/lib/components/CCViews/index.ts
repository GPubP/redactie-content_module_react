import { getViewRegistry } from '../../connectors/formRenderer';

import { CCTextLineView } from './TextLine';

export const registerCCViews = (): void => {
	const viewRegistry = getViewRegistry();

	if (viewRegistry) {
		viewRegistry.add([
			{
				name: 'textline',
				module: 'core',
				component: CCTextLineView,
			},
		]);
	}
};
