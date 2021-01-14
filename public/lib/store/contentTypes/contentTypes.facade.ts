import { BaseEntityFacade, SearchParams } from '@redactie/utils';

import { ContentTypesApiService, contentTypesApiService } from '../../services/contentTypes';

import { ContentTypesQuery, contentTypesQuery } from './contentTypes.query';
import { ContentTypesStore, contentTypesStore } from './contentTypes.store';

export class ContentTypesFacade extends BaseEntityFacade<
	ContentTypesStore,
	ContentTypesApiService,
	ContentTypesQuery
> {
	public readonly meta$ = this.query.meta$;
	public readonly contentTypes$ = this.query.contentTypes$;
	public readonly contentType$ = this.query.contentType$;

	public getContentTypes(siteId: string, searchParams: SearchParams): void {
		const { isFetching } = this.query.getValue();
		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getContentTypes(siteId, searchParams)
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

	public getContentType(siteId: string, uuid: string): void {
		const { isFetchingOne, contentType } = this.query.getValue();
		if (isFetchingOne || contentType?.uuid === uuid) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getContentType(siteId, uuid)
			.then(response => {
				if (response) {
					this.store.update({
						contentType: response,
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
}

export const contentTypesFacade = new ContentTypesFacade(
	contentTypesStore,
	contentTypesApiService,
	contentTypesQuery
);
