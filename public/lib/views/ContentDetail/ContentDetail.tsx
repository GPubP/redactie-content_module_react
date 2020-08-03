import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps, LoadingState } from '../../content.types';
import {
	useActiveTabs,
	useContentItem,
	useContentType,
	useNavigate,
	useRoutesBreadcrumbs,
} from '../../hooks';

import { CONTENT_UPDATE_TABS } from './ContentDetail.const';
import { ContentDetailMatchProps } from './ContentDetail.types';

const ContentDetail: FC<ContentRouteProps<ContentDetailMatchProps>> = ({
	match,
	location,
	route,
	tenantId,
}) => {
	const { siteId, contentId } = match.params;

	/**
	 * Hooks
	 */
	const { generatePath } = useNavigate();
	const activeTabs = useActiveTabs(CONTENT_UPDATE_TABS, location.pathname);
	const [contentItemLoading, contentItem] = useContentItem(siteId, contentId);
	const [contentTypeLoading, contentType] = useContentType(
		siteId,
		contentItem?.meta.contentType.uuid
	);
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content',
			target: '',
		},
	]);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

	useEffect(() => {
		if (
			contentTypeLoading !== LoadingState.Loading &&
			contentItemLoading !== LoadingState.Loading
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [contentTypeLoading, contentItemLoading]);

	/**
	 * Methods
	 */
	// const navigateToOverview = (): void => {
	// 	navigate(MODULE_PATHS.overview, { siteId });
	// };

	// const onFormSubmit = (values: any): void => {
	// 	if (contentItem) {
	// 		const request: ContentSchema = {
	// 			...contentItem,
	// 			fields: values,
	// 			meta: {
	// 				...contentItem.meta,
	// 				site: siteId,
	// 			},
	// 		};
	// 		updateContent(siteId, contentId, request).then(() => {
	// 			navigateToOverview();
	// 		});
	// 	}
	// };

	/**
	 * Render
	 */
	// const renderCreateContentForm = (): ReactElement | null => {
	// 	if (!contentItem || !contentType) {
	// 		return null;
	// 	}

	// 	const formProps = getFormPropsByCT(contentType);
	// 	const initialValues = contentItem.fields;
	// 	return (
	// 		<formsAPI.Form {...formProps} initialValues={initialValues} onSubmit={onFormSubmit}>
	// 			{({ submitForm }) => (
	// 				<div className="u-margin-top">
	// 					<Button
	// 						className="u-margin-right-xs"
	// 						onClick={() => submitForm()}
	// 						type="success"
	// 						htmlType="submit"
	// 					>
	// 						{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
	// 					</Button>
	// 					<Button onClick={navigateToOverview} outline>
	// 						{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
	// 					</Button>
	// 				</div>
	// 			)}
	// 		</formsAPI.Form>
	// 	);
	// };

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	const contentTypeLabel = contentItem?.meta.label;
	const headerTitle = contentTypeLabel ? `${contentTypeLabel} Bewerken` : '';
	const badges = contentTypeLabel
		? [
				{
					name: contentTypeLabel,
					type: 'primary',
				},
		  ]
		: [];

	return (
		<>
			<ContextHeader
				title={headerTitle}
				tabs={activeTabs}
				linkProps={(props: any) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.detail}/${props.href}`, {
						siteId,
						contentId,
					}),
					component: Link,
				})}
				badges={badges}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentDetail;
