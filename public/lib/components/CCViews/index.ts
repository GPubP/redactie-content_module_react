import { getViewRegistry } from '../../connectors/formRenderer';

import { CCContentSelectView } from './ContentSelect';
import { CCLinkView } from './Link';
import { CCTextBoxView } from './TextBox';
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
			{
				name: 'textbox',
				module: 'core',
				component: CCTextBoxView,
			},
			{
				name: 'link',
				module: 'core',
				component: CCLinkView,
			},
			{
				name: 'contentReference',
				module: 'core',
				component: CCContentSelectView,
			},
		]);
	}
};
