import { SearchParams } from '../../services/api/api.service.types';
import { ContentTypesApiService, contentTypesApiService } from '../../services/contentTypes';
import { BaseEntityFacade } from '../shared';

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
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetching(false));
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
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetchingOne(false));
	}
}

export const contentTypesFacade = new ContentTypesFacade(
	contentTypesStore,
	contentTypesApiService,
	contentTypesQuery
);
