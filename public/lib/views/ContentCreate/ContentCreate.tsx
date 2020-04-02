import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { FormsAPI } from '@redactie/form-renderer-module';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, ReactElement } from 'react';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { useContentTypes, useRoutes } from '../../hooks';
import { ContentCreateSchema, ContentStatus, createContent } from '../../services/content';
import { getFormPropsByCT } from '../../services/helpers';

import { ContentCreateMatchProps } from './ContentCreate.types';

const ContentCreate: FC<ContentRouteProps<ContentCreateMatchProps>> = ({
	match,
	history,
	tenantId,
}) => {
	const { contentTypeId, siteId } = match.params;
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	/**
	 * Hooks
	 */
	const [contentTypesLoading, contentType] = useContentTypes(contentTypeId);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`/${tenantId}/sites/${siteId}/content/overzicht`);
	};

	const onFormSubmit = (values: any): void => {
		if (contentType) {
			const request: ContentCreateSchema = {
				meta: {
					label: 'Dit is een titel',
					contentType: contentType._id,
					status: ContentStatus.DRAF,
				},
				fields: values,
			};
			createContent(request).then(() => {
				navigateToOverview();
			});
		}
	};

	/**
	 * Render
	 */
	const renderCreateContentForm = (): ReactElement | null => {
		if (!contentType) {
			return null;
		}

		const formProps = getFormPropsByCT(contentType);
		return (
			<div className="u-container u-wrapper">
				<div className="u-margin-top">
					<formsAPI.Form {...formProps} onSubmit={onFormSubmit} />
				</div>
			</div>
		);
	};

	const contentTypeLabel = contentType?.meta.label;
	const headerTitle = contentTypeLabel ? `${contentTypeLabel} Aanmaken` : '';
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
			<DataLoader loadingState={contentTypesLoading} render={renderCreateContentForm} />
		</>
	);
};

export default ContentCreate;
