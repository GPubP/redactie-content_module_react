import {
	AlertContainer,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useWorker,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ContentSchema } from '../../api/api.types';
import rolesRightsConnector from '../../connectors/rolesRights';
import sitesConnector from '../../connectors/sites';
import { MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { ALERT_CONTAINER_IDS } from '../../content.types';
import { getInitialContentValues, getTimeUntilLockExpires, runAllSubmitHooks } from '../../helpers';
import { useLock } from '../../hooks';
import { ContentStatus, ContentSystemNames } from '../../services/content';
import { contentFacade } from '../../store/content';
import { LockModel, locksFacade } from '../../store/locks';
import { ContentCompartmentModel } from '../../store/ui/contentCompartments';
import { SetLockWorkerData } from '../../workers/pollSetLock/pollSetLock.types';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import { ContentDetailEditMatchProps } from './ContentDetailEdit.types';

const ContentDetailEdit: FC<ContentDetailChildRouteProps<ContentDetailEditMatchProps>> = ({
	route,
	contentType,
	contentItem,
	contentItemDraft,
	match,
	tenantId,
	canUpdate,
	canDelete,
	workflow,
}) => {
	const { siteId, contentId, contentTypeId } = match.params;
	/**
	 * Hooks
	 */
	const { generatePath, navigate } = useNavigate(SITES_ROOT);
	const { push } = useHistory();
	const [, , externalLock, userLock] = useLock(contentId);
	const [initialLoadingState, setInitialLoadingState] = useState(LoadingState.Loading);
	const [hasChanges, resetDetectValueChanges] = useDetectValueChangesWorker(
		!!contentItemDraft && initialLoadingState === LoadingState.Loaded,
		contentItemDraft,
		BFF_MODULE_PUBLIC_PATH
	);
	const [site] = sitesConnector.hooks.useSite(siteId);

	const workerData = useMemo(
		() =>
			({
				siteId,
				tenantId,
				expiresAt: userLock?.expireAt || null,
				lockId: contentId,
				type: 'content',
			} as SetLockWorkerData),
		[contentId, userLock?.expireAt, siteId, tenantId] // eslint-disable-line react-hooks/exhaustive-deps
	);
	const [refreshedLock] = useWorker<SetLockWorkerData, LockModel>(
		BFF_MODULE_PUBLIC_PATH,
		'pollSetLock.worker',
		workerData,
		userLock
	);

	useEffect(() => {
		if (!canUpdate) {
			push(
				`/${tenantId}${
					rolesRightsConnector.api.consts.forbidden403Path
				}?redirect=${generatePath(MODULE_PATHS.overview, {
					siteId,
				})}`
			);
		}
	}, [canUpdate, generatePath, push, siteId, tenantId]);

	useEffect(() => {
		if (userLock || externalLock) {
			setInitialLoadingState(LoadingState.Loaded);
		}
	}, [externalLock, userLock]);

	// Set new default values for when new properties are added to CT post create
	useEffect(() => {
		if (!contentType) {
			return;
		}

		const defaultValue: ContentSchema = {
			...contentItem,
			fields: getInitialContentValues(contentType?.fields, contentItem.fields),
		};

		contentFacade.setContentItemDraft(defaultValue);
	}, [contentType]); // eslint-disable-line

	useEffect(() => locksFacade.setLockValue(contentId, refreshedLock), [contentId, refreshedLock]);

	useEffect(() => {
		if (externalLock) {
			return;
		}

		if (getTimeUntilLockExpires(userLock?.expireAt) > 0) {
			return;
		}

		locksFacade.setLock(siteId, contentId);
	}, [contentId, externalLock?.expireAt, siteId, userLock?.expireAt]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */
	const onCancel = (): void => {
		contentFacade.setContentItemDraft(contentItem);
	};

	const updateContentItem = async (
		contentItemDraft: ContentSchema,
		compartments: ContentCompartmentModel[]
	): Promise<void> => {
		try {
			const newContent = await contentFacade.updateContentItem(
				siteId,
				contentId,
				contentItemDraft,
				contentItemDraft.meta.status === ContentStatus.PUBLISHED,
				false
			);

			await runAllSubmitHooks(
				compartments,
				contentType,
				newContent || contentItemDraft,
				contentItem,
				site,
				'afterSubmit'
			);

			resetDetectValueChanges();
		} catch (error) {
			await runAllSubmitHooks(
				compartments,
				contentType,
				contentItemDraft,
				contentItem,
				site,
				'afterSubmit',
				error
			);
		} finally {
			contentFacade.setIsUpdating(false);
			contentFacade.setIsPublishing(false);
		}
	};

	const onSubmit = (
		contentItemDraft: ContentSchema,
		activeCompartment: ContentCompartmentModel,
		compartments: ContentCompartmentModel[]
	): void => {
		updateContentItem(contentItemDraft, compartments);
	};

	const onDelete = (): Promise<void> => {
		return contentFacade.removeContentItem(siteId, contentItem?.uuid!, contentItem);
	};

	const onStatusClick = (): void => {
		navigate(`${MODULE_PATHS.detailEdit}/status`, {
			siteId,
			contentId,
			contentTypeId,
		});
	};

	const onUpdatePublication = (
		content: ContentSchema,
		compartments: ContentCompartmentModel[]
	): void => {
		const data = {
			...content,
			meta: {
				...content.meta,
				status: ContentStatus.PUBLISHED,
				workflowState: ContentSystemNames.PUBLISHED,
			},
		};

		updateContentItem(data, compartments);
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			contentType,
			contentItemDraft,
			contentItem,
			hasChanges,
			onSubmit,
			onCancel,
			onDelete,
			onStatusClick,
			onUpdatePublication,
			showPublishedStatus: true,
			showDeleteButton: canDelete,
			workflow,
		};

		return (
			<>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.contentEdit}
				/>
				<RenderChildRoutes
					routes={route.routes}
					guardsMeta={{}}
					extraOptions={extraOptions}
				/>
			</>
		);
	};

	if (externalLock) {
		return null;
	}

	return <DataLoader loadingState={initialLoadingState} render={renderChildRoutes} />;
};

export default ContentDetailEdit;
