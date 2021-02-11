import { AlertContainer, HasChangesWorkerData, LoadingState, useWorker } from '@redactie/utils';
import { equals } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { ContentSchema } from '../../api/api.types';
import { RenderChildRoutes } from '../../components';
import DataLoader from '../../components/DataLoader/DataLoader';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../content.const';
import { getInitialContentValues, runAllSubmitHooks } from '../../helpers';
import { getTimeUntilLockExpires } from '../../helpers/getTimeUntilLockExpires';
import { useLock, useNavigate } from '../../hooks';
import { ContentStatus } from '../../services/content';
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
}) => {
	const { siteId, contentId } = match.params;
	/**
	 * Hooks
	 */
	const { navigate } = useNavigate();
	const [, , externalLock, userLock] = useLock(contentId);
	const [initialLoadingState, setInitialLoadingState] = useState(LoadingState.Loading);
	const hasChangesWorkerData = useMemo(
		() => ({
			currentValue: contentItem,
			nextValue: contentItemDraft,
		}),
		[contentItem, contentItemDraft]
	);
	const [hasChanges] = useWorker<HasChangesWorkerData, boolean>(
		BFF_MODULE_PUBLIC_PATH,
		'hasChanges.worker',
		hasChangesWorkerData,
		false
	);

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
		if (userLock || externalLock) {
			setInitialLoadingState(LoadingState.Loaded);
		}
	}, [externalLock, userLock]);

	// Set nieuw default values for when new properties are added to CT post create
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

	const onSubmit = (
		contentItemDraft: ContentSchema,
		activeCompartment: ContentCompartmentModel,
		compartments: ContentCompartmentModel[]
	): void => {
		// Every change with current status published should be saved as a draft version unless the status has changed
		const data =
			contentItem.meta.status === ContentStatus.PUBLISHED &&
			equals(contentItemDraft.meta.status, contentItem.meta.status)
				? {
						...contentItemDraft,
						meta: {
							...contentItemDraft.meta,
							status: ContentStatus.DRAFT,
						},
				  }
				: contentItemDraft;

		contentFacade
			.updateContentItem(siteId, contentId, data)
			.then(() =>
				runAllSubmitHooks(compartments, contentType, data, contentItem, 'afterSubmit')
			)
			.catch(error =>
				runAllSubmitHooks(
					compartments,
					contentType,
					data,
					contentItem,
					'afterSubmit',
					error
				)
			);
	};

	const onStatusClick = (): void => {
		navigate(`${MODULE_PATHS.detailEdit}/status`, {
			siteId,
			contentId,
		});
	};

	const onUpdatePublication = (content: ContentSchema): void => {
		const data = {
			...content,
			meta: {
				...content.meta,
				status: ContentStatus.PUBLISHED,
			},
		};
		contentFacade.updateContentItem(siteId, contentId, data, true).catch();
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
			onStatusClick,
			onUpdatePublication,
			showPublishedStatus: true,
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
