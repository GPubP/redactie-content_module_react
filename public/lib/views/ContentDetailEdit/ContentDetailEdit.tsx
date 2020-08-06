import React, { FC, ReactElement } from 'react';

import { ContentSchema } from '../../api/api.types';
import { RenderChildRoutes } from '../../components';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import { ContentDetailEditMatchProps } from './ContentDetailEdit.types';

const ContentDetailEdit: FC<ContentDetailChildRouteProps<ContentDetailEditMatchProps>> = ({
	route,
	contentType,
	contentItemDraft,
}) => {
	/**
	 * Methods
	 */
	const onCancle = (): void => {
		console.log('cancle edit');
	};

	const onSubmit = (content: ContentSchema): void => {
		console.log(content, 'update content item');
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			contentType,
			contentItemDraft,
			onSubmit,
			onCancle,
		};

		return (
			<RenderChildRoutes routes={route.routes} guardsMeta={{}} extraOptions={extraOptions} />
		);
	};

	return <>{renderChildRoutes()}</>;
};

export default ContentDetailEdit;
