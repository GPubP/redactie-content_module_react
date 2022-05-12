import { contentApiService } from '../services/content';
import { contentFacade } from '../store/content';

import { ContentAPI } from './api.types';

export const store: ContentAPI['store'] = {
	content: {
		facade: {
			getContentItem: contentFacade.getContentItem.bind(contentFacade),
			setBaseContentItem: contentFacade.setBaseContentItem.bind(contentFacade),
			getContentItemBySlug: contentFacade.getContentItemBySlug.bind(contentFacade),
			getContent: contentFacade.getContent.bind(contentFacade),
		},
		service: contentApiService,
	},
};
