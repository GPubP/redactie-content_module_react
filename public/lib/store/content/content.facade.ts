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
	public readonly isPublishing$ = this.query.isPublishing$;

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
						isFetching: false,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public getContentItem(siteId: string, uuid: string): void {
		this.store.setIsFetchingOne(true);

		this.service
			.getContentItem(siteId, uuid)
			.then(response => {
				if (response) {
					this.store.update({
						contentItem: response,
						isFetchingOne: false,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}

	public createContentItem(
		siteId: string,
		data: ContentCreateSchema
	): Promise<void | ContentSchema | null> {
		this.store.setIsCreating(true);

		return this.service
			.createContentItem(siteId, data)
			.then(response => {
				if (response) {
					this.store.update({
						contentItem: response,
						isCreating: false,
					});
				}
				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isCreating: false,
				});
			});
	}

	public updateContentItem(
		siteId: string,
		uuid: string,
		data: ContentSchema,
		publish = false
	): void {
		if (publish) {
			this.store.setIsPublishing(true);
		} else {
			this.store.setIsUpdating(true);
		}

		this.service
			.updateContentItem(siteId, uuid, data)
			.then(response => {
				if (response) {
					// Since the response data is not always right we need to fetch the latest content item
					// after each update
					// We can not call the getContentItem function because the loading states
					// will cause our components to destroy, this is not something that we want
					// TODO: Delete this code and update the contentItem directly from the response data
					// when the API is fixed
					this.service
						.getContentItem(siteId, uuid)
						.then(response => {
							if (response) {
								this.store.update({
									contentItem: response,
									isUpdating: false,
									isPublishing: false,
								});
							}
						})
						.catch(error => this.store.setError(error));
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
					isPublishing: false,
				});
			});
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
