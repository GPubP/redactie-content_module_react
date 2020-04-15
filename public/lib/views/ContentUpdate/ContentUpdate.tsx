import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { FormsAPI } from '@redactie/form-renderer-module';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS } from '../../content.const';
import { ContentRouteProps, LoadingState } from '../../content.types';
import { useContentItem, useContentType, useRoutes } from '../../hooks';
import { ContentSchema, updateContent } from '../../services/content';
import { getFormPropsByCT } from '../../services/helpers';

import { ContentUpdateMatchProps } from './ContentUpdate.types';

const ContentCreate: FC<ContentRouteProps<ContentUpdateMatchProps>> = ({
	match,
	history,
	tenantId,
}) => {
	const { siteId, contentId } = match.params;
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	/**
	 * Hooks
	 */
	const [contentItemLoading, contentItem] = useContentItem(contentId);
	const [contentTypeLoading, contentType] = useContentType(contentItem?.meta.contentType.uuid);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		if (
			(contentTypeLoading === LoadingState.Loaded ||
				contentTypeLoading === LoadingState.Error) &&
			(contentItemLoading === LoadingState.Loaded ||
				contentItemLoading === LoadingState.Error)
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [contentTypeLoading, contentItemLoading]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`/${tenantId}/sites/${siteId}/content/overzicht`);
	};

	const onFormSubmit = (values: any): void => {
		if (contentItem) {
			const request: ContentSchema = {
				...contentItem,
				fields: values,
			};
			updateContent(contentId, request).then(() => {
				navigateToOverview();
			});
		}
	};

	/**
	 * Render
	 */
	const renderCreateContentForm = (): ReactElement | null => {
		if (!contentItem || !contentType) {
			return null;
		}

		const formProps = getFormPropsByCT(contentType);
		const initialValues = contentItem.fields;
		return (
			<formsAPI.Form {...formProps} initialValues={initialValues} onSubmit={onFormSubmit}>
				{({ submitForm }) => (
					<div className="u-margin-top">
						<Button
							className="u-margin-right-xs"
							onClick={() => submitForm()}
							type="success"
						>
							Bewaar
						</Button>
						<Button onClick={navigateToOverview} outline>
							Annuleer
						</Button>
					</div>
				)}
			</formsAPI.Form>
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
			<ContextHeader title={headerTitle} badges={badges}>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderCreateContentForm} />
			</Container>
		</>
	);
};

export default ContentCreate;
