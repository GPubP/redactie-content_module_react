import { resolveUrl } from '@wcm/pattern-resolver';

import { ContentSchema } from '../../services/content';
import { ContentTypeSchema } from '../../services/contentTypes';

export const applyUrlPattern = async (
	pattern: string,
	id: string,
	contentItemMeta: Partial<ContentSchema['meta']>,
	contentType: ContentTypeSchema
): Promise<string> => {
	const resolver = {
		item: {
			id,
			label: contentItemMeta.label!,
			lang: contentItemMeta.lang!,
			slug: contentItemMeta.slug![contentItemMeta.lang!],
			created: contentItemMeta.created!,
		},
		site: {
			id: contentItemMeta.site!,
		},
		'content-type': {
			label: contentType?.meta?.label,
		},
	};

	return resolveUrl(pattern, resolver)
		.catch(() => pattern)
		.then(value => `/${value}`);
};
