import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, useEffect } from 'react';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { useContentType } from '../../hooks';
import {
	ContentCreateSchema,
	ContentSchema,
	ContentStatus,
	createContent,
} from '../../services/content';
import { useInternalFacade } from '../../store/content/internal/internal.facade';

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
	const [, registerContent, activateContent] = useInternalFacade();

	useEffect(() => {
		if (!contentType) {
			return;
		}

		const defaultValue: ContentSchema = {
			fields: {},
			modulesData: {},
			meta: {
				label: '',
				slug: {
					nl: '',
				},
				contentType: contentType,
				status: ContentStatus.DRAFT,
				site: siteId,
			},
		};

		registerContent([defaultValue]);
		activateContent('new');
	}, [contentType]); // eslint-disable-line

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`/${tenantId}/sites/${siteId}/content/overzicht`);
	};

	const onFormSubmit = (content: ContentSchema): void => {
		if (!contentType || !content) {
			return;
		}

		const request: ContentCreateSchema = {
			meta: {
				// TODO: Where does this string come from?
				label: content.meta?.label,
				slug: content.meta?.slug,
				contentType: contentType._id,
				status: ContentStatus.DRAFT,
				site: siteId,
			},
			modulesData: content.modulesData,
			fields: content.fields,
		};

		createContent(request).then(() => {
			navigateToOverview();
		});
	};

	/**
	 * Render
	 */

	const renderChildRoutes = (): any => {
		if (!contentType) {
			return;
		}

		const activeRoute =
			routes?.find(
				item =>
					item.path.replace(
						/\/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b\/sites/,
						''
					) === MODULE_PATHS.create
			) || null;

		return (
			<div className="u-margin-top">
				{Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
					tenantId,
					routes: activeRoute?.routes,
					contentType: contentType,
					onSubmit: (value: ContentSchema) => onFormSubmit(value),
					cancel: () => navigateToOverview(),
				})}
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
			<DataLoader loadingState={contentTypesLoading} render={renderChildRoutes} />
		</>
	);
};

export default ContentCreate;
