import { BaseMultiEntityFacade, SearchParams } from '@redactie/utils';

import { contentApiService, ContentApiService } from '../../services/content';

import { ccContentQuery, CcContentQuery } from './ccContent.query';
import { ccContentStore, CcContentStore } from './ccContent.store';

export class CcContentFacade extends BaseMultiEntityFacade<
	CcContentStore,
	ContentApiService,
	CcContentQuery
> {
	/**
	 * API integration
	 */
	public async getContent(
		key: string,
		siteId: string,
		searchParams: SearchParams,
		reload = false
	): Promise<void> {
		const oldValue = this.query.getItem(key);

		if (!reload && oldValue) {
			return;
		}

		reload && oldValue ? this.store.setItemIsFetching(key, true) : this.store.addItem(key);

		return this.service
			.getContent(siteId, searchParams)
			.then(response => {
				if (response) {
					this.store.setItemValue(key, response.data);
				}
			})
			.catch(error => {
				this.store.setItemError(key, error);
			})
			.finally(() => {
				this.store.setItemIsFetching(key, false);
			});
	}

	public async getContentItem(siteId: string, uuid: string, reload = false): Promise<void> {
		const oldValue = this.query.getItem(uuid);

		if (!reload && oldValue) {
			return;
		}

		reload && oldValue
			? this.store.setItemIsFetching(uuid, true)
			: this.store.addItem(uuid, {
					isFetching: true,
					isCreating: false,
					isRemoving: false,
					isUpdating: false,
					error: null,
					id: uuid,
					value: null,
			  });

		return this.service
			.getContentItem(siteId, uuid)
			.then(response => {
				if (response) {
					this.store.setItemValue(uuid, response);
				}
			})
			.catch(error => {
				this.store.setItemError(uuid, error);
			});
	}
}

export const ccContentFacade = new CcContentFacade(
	ccContentStore,
	contentApiService,
	ccContentQuery
);
