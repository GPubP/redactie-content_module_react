import { AlertContainer } from '@redactie/utils';
import { equals } from 'ramda';
import React, { FC, ReactElement } from 'react';

import { ContentSchema } from '../../api/api.types';
import { RenderChildRoutes } from '../../components';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../content.const';
import { useNavigate } from '../../hooks';
import { ContentStatus } from '../../services/content';
import { contentFacade } from '../../store/content';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import { ContentDetailEditMatchProps } from './ContentDetailEdit.types';

const ContentDetailEdit: FC<ContentDetailChildRouteProps<ContentDetailEditMatchProps>> = ({
	route,
	contentType,
	contentItem,
	contentItemDraft,
	match,
}) => {
	const { siteId, contentId } = match.params;
	/**
	 * Hooks
	 */
	const { navigate } = useNavigate();

	/**
	 * Methods
	 */
	const onCancel = (): void => {
		contentFacade.setContentItemDraft(contentItem);
	};

	const onSubmit = (contentItemDraft: ContentSchema): void => {
		// Every change with current status published should be saved as a draft version unless the status has changed
		if (
			contentItem.meta.status === ContentStatus.PUBLISHED &&
			equals(contentItemDraft.meta.status, contentItem.meta.status)
		) {
			contentFacade.updateContentItem(siteId, contentId, {
				...contentItemDraft,
				meta: {
					...contentItemDraft.meta,
					status: ContentStatus.DRAFT,
				},
			});
			return;
		}

		contentFacade.updateContentItem(siteId, contentId, contentItemDraft);
	};

	const onStatusClick = (): void => {
		navigate(`${MODULE_PATHS.detailEdit}/status`, {
			siteId,
			contentId,
		});
	};

	const onUpdatePublication = (content: ContentSchema): void => {
		contentFacade.updateContentItem(
			siteId,
			contentId,
			{
				...content,
				meta: {
					...content.meta,
					status: ContentStatus.PUBLISHED,
				},
			},
			true
		);
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			contentType,
			contentItemDraft,
			contentItem,
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

	return <>{renderChildRoutes()}</>;
};

export default ContentDetailEdit;
