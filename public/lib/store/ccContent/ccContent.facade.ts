import { BaseMultiEntityFacade } from '@redactie/utils';
import { first } from 'rxjs/operators';

import { SearchParams } from '../../services/api';
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
		const oldValue = await new Promise(resolve =>
			this.query
				.getItem(key)
				.pipe(first())
				.subscribe(resolve, () => resolve(null))
		);

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
			});
	}

	public async getContentItem(siteId: string, uuid: string, reload = false): Promise<void> {
		const oldValue = await new Promise(resolve =>
			this.query
				.getItem(uuid)
				.pipe(first())
				.subscribe(resolve, () => resolve(null))
		);

		if (!reload && oldValue) {
			return;
		}

		reload && oldValue ? this.store.setItemIsFetching(uuid, true) : this.store.addItem(uuid);

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
