import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { FormikValues } from 'formik';
import React, { FC, useEffect } from 'react';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { useContentType } from '../../hooks';
import { ContentCreateSchema, ContentStatus, createContent } from '../../services/content';

import { ContentCreateMatchProps } from './ContentCreate.types';

const ContentCreate: FC<ContentRouteProps<ContentCreateMatchProps>> = ({
	match,
	history,
	tenantId,
	routes,
}) => {
	const { contentTypeId, siteId } = match.params;

	/**
	 * Hooks
	 */
	const [contentTypesLoading, contentType] = useContentType(contentTypeId);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`/${tenantId}/sites/${siteId}/content/overzicht`);
	};

	const onFormSubmit = (values: any): void => {
		if (!contentType) {
			return;
		}

		const request: ContentCreateSchema = {
			meta: {
				// TODO: Where does this string come from?
				label: 'Dit is een titel',
				contentType: contentType._id,
				status: ContentStatus.DRAFT,
			},
			fields: values,
		};

		createContent(request).then(() => {
			navigateToOverview();
		});
	};

	/**
	 * Render
	 */

	const renderChildRoutes = (): any => {
		const activeRoute =
			routes?.find(
				item =>
					item.path.replace(
						/\/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b\/sites/,
						''
					) === MODULE_PATHS.create
			) || null;

		return (
			<div className="u-container u-wrapper">
				<div className="u-margin-top">
					{Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
						tenantId,
						routes: activeRoute?.routes,
						contentType: contentType,
						content: {},
						onSubmit: (value: FormikValues) => onFormSubmit(value),
						cancel: () => navigateToOverview(),
					})}
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
			<Container>
				<DataLoader loadingState={contentTypesLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentCreate;
