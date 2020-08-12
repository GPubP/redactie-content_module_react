import React, { FC, ReactElement } from 'react';

import { ContentSchema } from '../../api/api.types';
import { RenderChildRoutes } from '../../components';
import { MODULE_PATHS } from '../../content.const';
import { useNavigate } from '../../hooks';
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
	const onCancle = (): void => {
		contentFacade.setContentItemDraft(contentItem);
	};

	const onSubmit = (content: ContentSchema): void => {
		contentFacade.updateContentItem(siteId, contentId, content);
	};

	const onStatusClick = (): void => {
		navigate(`${MODULE_PATHS.detailEdit}/status`, {
			siteId,
			contentId,
		});
	};

	const onUpdatePublication = (content: ContentSchema): void => {
		const publishContent = true;
		contentFacade.updateContentItem(siteId, contentId, content, publishContent);
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
			onCancle,
			onStatusClick,
			onUpdatePublication,
		};

		return (
			<RenderChildRoutes routes={route.routes} guardsMeta={{}} extraOptions={extraOptions} />
		);
	};

	return <>{renderChildRoutes()}</>;
};

export default ContentDetailEdit;
