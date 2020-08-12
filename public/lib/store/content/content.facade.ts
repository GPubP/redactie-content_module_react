import { SearchParams } from '../../services/api';
import {
	contentApiService,
	ContentApiService,
	ContentCreateSchema,
	ContentSchema,
} from '../../services/content';
import { BaseEntityFacade } from '../shared';

import { ContentModel } from './content.model';
import { contentQuery, ContentQuery } from './content.query';
import { contentStore, ContentStore } from './content.store';

export class ContentFacade extends BaseEntityFacade<ContentStore, ContentApiService, ContentQuery> {
	public readonly meta$ = this.query.meta$;
	public readonly content$ = this.query.content$;
	public readonly contentItem$ = this.query.contentItem$;
	public readonly contentItemDraft$ = this.query.contentItemDraft$;

	/**
	 * API integration
	 */
	public getContent(siteId: string, searchParams: SearchParams): void {
		this.store.setIsFetching(true);

		this.service
			.getContent(siteId, searchParams)
			.then(response => {
				if (response) {
					this.store.set(response.data);
					this.store.update({
						meta: response.paging,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetching(false));
	}

	public getContentItem(siteId: string, uuid: string): void {
		const { isFetchingOne, contentItem } = this.query.getValue();
		if (isFetchingOne || contentItem?.uuid === uuid) {
			return;
		}

		this.store.setIsFetchingOne(true);

		this.service
			.getContentItem(siteId, uuid)
			.then(response => {
				if (response) {
					this.store.update({
						contentItem: response,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetchingOne(false));
	}

	public createContentItem(siteId: string, data: ContentCreateSchema): void {
		this.store.setIsCreating(true);

		this.service
			.createContentItem(siteId, data)
			.then(response => {
				if (response) {
					this.store.update({
						contentItem: response,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsCreating(false));
	}

	public updateContentItem(
		siteId: string,
		uuid: string,
		data: ContentSchema,
		publish = false
	): void {
		this.store.setIsUpdating(true);

		this.service
			.updateContentItem(siteId, uuid, data, publish)
			.then(response => {
				if (response) {
					this.store.update({
						contentItem: response,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsUpdating(false));
	}

	/**
	 * Helpers
	 */
	public setContentItemDraft(data: ContentModel): void {
		this.store.update({
			contentItemDraft: data,
		});
	}

	public clearContentItemDraft(): void {
		this.store.update({
			contentItemDraft: undefined,
		});
	}

	public clearContentItem(): void {
		this.store.update({
			contentItem: undefined,
		});
	}

	public updateContentItemDraft(data: ContentModel): void {
		this.store.update({
			contentItemDraft: data,
		});
	}
}

export const contentFacade = new ContentFacade(contentStore, contentApiService, contentQuery);
