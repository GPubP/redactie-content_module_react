import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';

import { ContentSlugModel, ContentSlugState } from './contentSlugs.model';
import { ContentSlugStore, contentSlugStore } from './contentSlugs.store';

export class ContentSlugsQuery extends QueryEntity<ContentSlugState> {
	public all$ = this.selectAll();
	public active$ = this.selectActive();
	public contentSlug$ = (
		siteId: string,
		contentId: string,
		slug: string
	): Observable<ContentSlugModel> => this.select(`${siteId}_${contentId}_${slug}`);

	constructor(protected store: ContentSlugStore) {
		super(store);
	}
}

export const contentSlugsQuery = new ContentSlugsQuery(contentSlugStore);
