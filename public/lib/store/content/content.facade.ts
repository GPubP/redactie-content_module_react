import { alertService, BaseEntityFacade, SearchParams } from '@redactie/utils';
import { omit, path, pick } from 'ramda';

import { ContentTypeSchema } from '../../..';
import { WORKING_TITLE_KEY } from '../../content.const';
import { ALERT_CONTAINER_IDS } from '../../content.types';
import { applyUrlPattern } from '../../helpers/applyUrlPattern/applyUrlPattern';
import {
	ContentApiService,
	contentApiService,
	ContentCreateSchema,
	ContentSchema,
	ContentSystemNames,
} from '../../services/content';

import { getAlertMessages } from './content.messages';
import { ContentModel } from './content.model';
import { contentQuery, ContentQuery } from './content.query';
import { contentStore, ContentStore } from './content.store';

export class ContentFacade extends BaseEntityFacade<ContentStore, ContentApiService, ContentQuery> {
	public readonly alertContainerProps = {
		create: {
			containerId: ALERT_CONTAINER_IDS.contentCreate,
		},
		update: {
			containerId: ALERT_CONTAINER_IDS.contentEdit,
		},
		remove: {
			containerId: ALERT_CONTAINER_IDS.contentRemove,
		},
	};

	public readonly meta$ = this.query.meta$;
	public readonly content$ = this.query.content$;
	public readonly contentItem$ = this.query.contentItem$;
	public readonly contentItemDraft$ = this.query.contentItemDraft$;
	public readonly isPublishing$ = this.query.isPublishing$;

	public setIsUpdating(isUpdating = false): void {
		this.store.setIsUpdating(isUpdating);
	}

	public setIsPublishing(isPublishing = false): void {
		this.store.setIsPublishing(isPublishing);
	}

	public setIsCreating(isCreating = false): void {
		this.store.setIsCreating(isCreating);
	}

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
						error: null,
						contentItem: {
							...response,
							meta: {
								...response.meta,
								workflowState: response.meta.workflowState
									? response.meta.workflowState
									: (ContentSystemNames as Record<string, string>)[
											response.meta.status
									  ],
							},
						},
						isFetchingOne: false,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error: {
						...error,
						actionType: 'fetchingOne',
					},
					isFetchingOne: false,
				});
			});
	}

	public getContentItemBySlug(siteId: string, uuid: string): void {
		this.store.setIsFetchingOne(true);

		this.service
			.getContentItemBySlug(siteId, uuid)
			.then(response => {
				if (!response) {
					return;
				}
				this.store.update({
					error: null,
					contentItem: {
						...response,
						meta: {
							...response.meta,
							workflowState: response.meta.workflowState
								? response.meta.workflowState
								: (ContentSystemNames as Record<string, string>)[
										response.meta.status
								  ],
						},
					},
					isFetchingOne: false,
				});
			})
			.catch(error => {
				this.store.update({
					error: {
						...error,
						actionType: 'fetchingOne',
					},
					isFetchingOne: false,
				});
			});
	}

	public createContentItem(
		siteId: string,
		data: ContentCreateSchema
	): Promise<void | ContentSchema | null> {
		alertService.dismiss();
		this.store.setIsCreating(true);

		return this.service
			.createContentItem(siteId, data)
			.then(response => {
				if (response) {
					this.store.update({
						contentItem: response,
						isCreating: false,
					});
					alertService.success(
						getAlertMessages(response).create.success,
						this.alertContainerProps.update
					);
				}
				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isCreating: false,
				});
				alertService.danger(
					getAlertMessages((data as unknown) as ContentSchema).create.error,
					this.alertContainerProps.create
				);
				throw error;
			});
	}

	public removeContentItem(
		siteId: string,
		contentId: string,
		data: ContentSchema
	): Promise<void> {
		const alertProps = getAlertMessages((data as unknown) as ContentSchema);
		this.store.setIsRemoving(true);

		return this.service
			.removeContentItem(siteId, contentId)
			.then(response => {
				alertService.success(alertProps.remove.success, this.alertContainerProps.remove);

				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isRemoving: false,
				});
				alertService.danger(alertProps.remove.error, this.alertContainerProps.update);
				throw error;
			});
	}

	public updateContentItem(
		siteId: string,
		uuid: string,
		data: ContentSchema,
		publish = false,
		unsetLoaders = true
	): Promise<ContentSchema | null> {
		if (publish) {
			this.store.setIsPublishing(true);
		} else {
			this.store.setIsUpdating(true);
		}

		const alertProps = publish ? getAlertMessages(data).publish : getAlertMessages(data).update;

		alertService.dismiss();

		return this.service
			.updateContentItem(siteId, uuid, {
				...data,
				meta: {
					...data.meta,
					contentType: pick(['uuid', '_id'], data.meta.contentType),
				},
			})
			.then(response => {
				if (!response) {
					return null;
				}

				this.store.update({
					contentItem: response,
					contentItemDraft: response,
					...(unsetLoaders
						? {
								isUpdating: false,
								isPublishing: false,
						  }
						: {}),
				});
				alertService.success(alertProps.success, this.alertContainerProps.update);

				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
					isPublishing: false,
				});
				alertService.danger(alertProps.error, this.alertContainerProps.update);
				throw error;
			});
	}

	/**
	 * Helpers
	 */
	public async setContentItemDraft(data: ContentModel): Promise<void> {
		const currentMetaValue = this.store.getValue().contentItemDraft?.meta!;
		const sharedValues = [
			this.store.getValue().contentItemDraft?.uuid || '',
			{ ...currentMetaValue, ...data.meta },
			data.meta.contentType!,
		] as const;
		const urlPathValue = path(['urlPath', currentMetaValue?.lang])(currentMetaValue)
			? await applyUrlPattern(
					currentMetaValue.urlPath![currentMetaValue.lang].pattern || '',
					...sharedValues
			  )
			: '';

		const calculatedPathValue = path(['urlPath', currentMetaValue?.lang])(currentMetaValue)
			? await applyUrlPattern(
					currentMetaValue.contentType.meta.urlPath?.pattern || '',
					...sharedValues
			  )
			: '';

		this.store.update({
			contentItemDraft: {
				...data,
				meta: {
					...data.meta,
					urlPath: {
						...data.meta.urlPath,
						[data.meta.lang]: {
							value: urlPathValue,
							pattern: path(['urlPath', data.meta.lang])(data.meta)
								? data.meta.urlPath![data.meta.lang!].pattern
								: currentMetaValue?.urlPath![currentMetaValue.lang].pattern || '',
							calculated: calculatedPathValue,
						},
					},
				},
			},
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

	public updateContentFieldsDraft(data: ContentSchema['fields']): void {
		const updatedFields = omit([WORKING_TITLE_KEY], data);
		const label = data[WORKING_TITLE_KEY];

		this.store.update(state => ({
			contentItemDraft: {
				...state.contentItemDraft,
				fields: updatedFields,
				meta: {
					...state.contentItemDraft?.meta,
					label,
				},
			},
		}));
	}

	public async updateContentMetaDraft(
		data: Partial<ContentSchema['meta']>,
		contentType?: ContentTypeSchema
	): Promise<void> {
		const currentMetaValue = this.store.getValue().contentItemDraft?.meta!;
		const sharedValues = [
			this.store.getValue().contentItemDraft?.uuid || '',
			{ ...currentMetaValue, ...data },
			data.contentType!,
		] as const;
		const urlPathValue = path(['urlPath', currentMetaValue?.lang!])(currentMetaValue)
			? await applyUrlPattern(
					currentMetaValue.urlPath![currentMetaValue.lang].pattern || '',
					...sharedValues
			  )
			: '';
		const calculatedPathValue = path(['urlPath', currentMetaValue?.lang])(currentMetaValue)
			? await applyUrlPattern(
				currentMetaValue.contentType.meta.urlPath?.pattern || '',
					...sharedValues
			  )
			: '';

		this.store.update(state => ({
			contentItemDraft: {
				...state.contentItemDraft,
				meta: {
					...state.contentItemDraft?.meta,
					...data,
					...(contentType?.meta.canBeFiltered
						? {
								urlPath: {
									...state.contentItemDraft?.meta.urlPath,
									[currentMetaValue.lang]: {
										value: urlPathValue,
										pattern: path(['urlPath', data.lang!])(data)
											? data.urlPath![currentMetaValue.lang].pattern
											: currentMetaValue.urlPath![currentMetaValue.lang]
													.pattern,
										calculated: calculatedPathValue,
									},
								},
						  }
						: {}),
				},
			},
		}));
	}

	public updateContentModuleDraft(compartmentName: string, data: any): void {
		this.store.update(state => ({
			contentItemDraft: {
				...state.contentItemDraft,
				modulesData: {
					...state.contentItemDraft?.modulesData,
					[compartmentName]: data,
				},
			},
		}));
	}

	public clearError(): void {
		this.store.update({
			error: null,
		});
	}
}

export const contentFacade = new ContentFacade(contentStore, contentApiService, contentQuery);
