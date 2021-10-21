import { contentFacade } from '../store/content';

import { ContentAPI } from './api.types';

export const store: ContentAPI['store'] = {
	content: {
		facade: {
			getContentItem: contentFacade.getContentItem.bind(contentFacade),
		},
	},
};
