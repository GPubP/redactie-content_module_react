import { ResolverType, resolveUrl } from '@wcm/pattern-resolver';
import { NavItem } from '@redactie/navigation-module'
import navigationConnector from '../../connectors/navigation';

import { ContentSchema } from '../../services/content';
import { ContentTypeSchema } from '../../services/contentTypes';

function getPathByNavigationBreadcrumbs(path = '', navigationItem: NavItem): string {
	const parentPath: string =
		['primary', 'internal'].includes(navigationItem.properties?.type || '') &&
		navigationItem?.externalUrl
			? (navigationItem.externalUrl.replace(/^http(s)?:\/\/(.*?)(\/|$)/, '') ||
					navigationItem.slug) ??
			  ''
			: navigationItem?.slug ?? '';

	const prefixedParentPath =
		parentPath && parentPath.charAt(0) !== '/' ? `/${parentPath}` : parentPath;

	const newPath = `${path}${prefixedParentPath}`;

	if (!Array.isArray(navigationItem?.items) || !navigationItem.items[0]) {
		return newPath;
	}

	return getPathByNavigationBreadcrumbs(newPath, navigationItem.items[0]);
}

export const applyUrlPattern = async (
	pattern: string,
	id: string,
	contentItemMeta: Partial<ContentSchema['meta']>,
	contentType: ContentTypeSchema
): Promise<string> => {
	const resolver: ResolverType = {
		item: {
			id,
			label: contentItemMeta.label!,
			lang: contentItemMeta.lang!,
			slug: contentItemMeta.slug![contentItemMeta.lang!],
			created: contentItemMeta.created!,
			nav: {
				parents: async () => {
					try {
						await navigationConnector.api.store.sitestructureBreadcrumbsFacade.getBreadcrumbs(
							contentItemMeta.site || '',
							id || 'new'
						)
						const breadcrumb = navigationConnector.api.store.sitestructureBreadcrumbsFacade.getItemValue(id);
						const parentPath = getPathByNavigationBreadcrumbs('', breadcrumb);

						return parentPath;
					} catch {
						return '';
					}
				},
			},
			menu: {
				// Not supported yet
				parents: '',
			},
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
		.then(value => `/${value.charAt(0) === '/' ? value.substring(1) : value}`);
};
