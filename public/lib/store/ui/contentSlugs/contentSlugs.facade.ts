import { contentApiService, ContentApiService } from '../../../services/content';

import { ContentSlugsQuery, contentSlugsQuery } from './contentSlugs.query';
import { contentSlugStore, ContentSlugStore } from './contentSlugs.store';

export class ContentSlugsFacade {
	constructor(
		private store: ContentSlugStore,
		private query: ContentSlugsQuery,
		private service: ContentApiService
	) {}

	public readonly all$ = this.query.all$;
	public readonly contentSlug$ = this.query.contentSlug$;

	public async validateSlug(
		siteId: string,
		contentId: string,
		slug: string,
		language: string
	): Promise<boolean> {
		const id = `${siteId}_${contentId}_${slug}`;
		const contentSlug = this.query.getEntity(id);

		if (contentSlug?.loading) {
			return contentSlug.isValid;
		}

		this.store.upsert(id, {
			id,
			slug,
			contentId,
			isValid: false,
			loading: true,
		});

		try {
			await this.service.validateSlug(siteId, {
				id: contentId,
				slug,
				language,
			});

			this.store.upsert(id, {
				isValid: true,
				loading: false,
			});

			return true;
		} catch (error) {
			this.store.upsert(id, {
				isValid: false,
				loading: false,
			});

			return false;
		}
	}

	public clearSlugs(): void {
		this.store.reset();
	}
}

export const contentSlugsFacade = new ContentSlugsFacade(
	contentSlugStore,
	contentSlugsQuery,
	contentApiService
);
