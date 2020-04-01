import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, ReactElement } from 'react';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { useContentTypes, useRoutes } from '../../hooks';

import { ContentCreateMatchProps } from './ContentCreate.types';

const ContentCreate: FC<ContentRouteProps<ContentCreateMatchProps>> = ({ match, tenantId }) => {
	const { contentTypeId } = match.params;

	/**
	 * Hooks
	 */
	const [contentTypesLoading, contentType] = useContentTypes(contentTypeId);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

	/**
	 * Render
	 */
	const contentTypeLabel = contentType?.meta.label;
	const headerTitle = contentTypeLabel ? `${contentTypeLabel} bewerken` : '';
	const badges = contentTypeLabel
		? [
				{
					name: contentTypeLabel,
					type: 'primary',
				},
		  ]
		: [];

	const renderCreateContentForm = (): ReactElement => {
		return <div>Render form</div>;
	};

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
