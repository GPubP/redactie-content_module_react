import { AlertContainer } from '@redactie/utils';
import { equals } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import { ContentSchema } from '../../api/api.types';
import { RenderChildRoutes } from '../../components';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../content.const';
import { runAllSubmitHooks } from '../../helpers';
import { useNavigate } from '../../hooks';
import { ContentStatus } from '../../services/content';
import { contentFacade } from '../../store/content';
import { ContentCompartmentModel } from '../../store/ui/contentCompartments';
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
	const hasChanges = useMemo(() => !equals(contentItem, contentItemDraft), [
		contentItem,
		contentItemDraft,
	]);

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
			.then(() => runAllSubmitHooks(compartments, contentType, data, 'afterSubmit'))
			.catch(error =>
				runAllSubmitHooks(compartments, contentType, data, 'afterSubmit', error)
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

	return <>{renderChildRoutes()}</>;
};

export default ContentDetailEdit;
