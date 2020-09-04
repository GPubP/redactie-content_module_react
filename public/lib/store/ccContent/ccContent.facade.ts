import { ALERT_CONTAINER_IDS } from '../../content.const';
import { SearchParams } from '../../services/api';
import { contentApiService, ContentApiService } from '../../services/content';
import { BaseEntityFacade } from '../shared';

import { ccContentQuery, CcContentQuery } from './ccContent.query';
import { ccContentStore, CcContentStore } from './ccContent.store';

export class CcContentFacade extends BaseEntityFacade<
	CcContentStore,
	ContentApiService,
	CcContentQuery
> {
	private readonly alertContainerProps = {
		containerId: ALERT_CONTAINER_IDS.contentEdit,
	};

	public readonly content$ = this.query.content$;
	public readonly contentItem$ = this.query.contentItem$;

	/**
	 * API integration
	 */
	public getContent(siteId: string, searchParams: SearchParams): Promise<void> {
		this.store.setIsFetching(true);

		return this.service
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
}

export const ccContentFacade = new CcContentFacade(
	ccContentStore,
	contentApiService,
	ccContentQuery
);
