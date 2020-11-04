import { AlertContainer, LoadingState } from '@redactie/utils';
import { equals } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { ContentSchema } from '../../api/api.types';
import { RenderChildRoutes } from '../../components';
import DataLoader from '../../components/DataLoader/DataLoader';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../content.const';
import { runAllSubmitHooks } from '../../helpers';
import { useLock, useNavigate, useWorker } from '../../hooks';
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
	const hasChanges = useMemo(() => !equals(contentItem, contentItemDraft), [
		contentItem,
		contentItemDraft,
	]);
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
		'pollSetLock.worker',
		workerData
	);

	useEffect(() => {
		if (userLock || externalLock) {
			setInitialLoadingState(LoadingState.Loaded);
		}
	}, [externalLock, userLock]);

	useEffect(() => locksFacade.setLockValue(contentId, refreshedLock), [contentId, refreshedLock]);

	useEffect(() => {
		if (externalLock) {
			return;
		}

		locksFacade.setLock(siteId, contentId);
	}, [contentId, externalLock, siteId]);

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
				runAllSubmitHooks(
					activeCompartment,
					compartments,
					contentType,
					data,
					false,
					'afterSubmit'
				)
			)
			.catch(error =>
				runAllSubmitHooks(
					activeCompartment,
					compartments,
					contentType,
					data,
					false,
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
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.contentEdit} />
				</div>
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
