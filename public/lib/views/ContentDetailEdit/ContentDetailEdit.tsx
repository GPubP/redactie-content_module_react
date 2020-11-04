import { AlertContainer, LoadingState } from '@redactie/utils';
import { equals } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { ContentSchema } from '../../api/api.types';
import { RenderChildRoutes } from '../../components';
import DataLoader from '../../components/DataLoader/DataLoader';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../content.const';
import { runAllSubmitHooks } from '../../helpers';
import { useLock, useNavigate } from '../../hooks';
import { ContentStatus } from '../../services/content';
import { contentFacade } from '../../store/content';
import { locksFacade } from '../../store/locks';
import { ContentCompartmentModel } from '../../store/ui/contentCompartments';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import { LOCK_SET_REFRESH_TIME } from './ContentDetailEdit.const';
import { ContentDetailEditMatchProps } from './ContentDetailEdit.types';

const ContentDetailEdit: FC<ContentDetailChildRouteProps<ContentDetailEditMatchProps>> = ({
	route,
	contentType,
	contentItem,
	contentItemDraft,
	match,
	lock,
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

	useEffect(() => {
		if (userLock || externalLock) {
			setInitialLoadingState(LoadingState.Loaded);
		}
	}, [externalLock, userLock]);

	useEffect(() => {
		if (lock) {
			return;
		}

		locksFacade.setLock(siteId, contentId);

		const interval = setInterval(
			() => locksFacade.setLock(siteId, contentId),
			LOCK_SET_REFRESH_TIME
		);

		return () => clearInterval(interval);
	}, [contentId, lock, siteId]);

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

	if (lock) {
		return null;
	}

	return <DataLoader loadingState={initialLoadingState} render={renderChildRoutes} />;
};

export default ContentDetailEdit;
