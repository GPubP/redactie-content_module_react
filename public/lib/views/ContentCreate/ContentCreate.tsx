import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import React, { FC, useContext, useEffect, useMemo } from 'react';

import { DataLoader, RenderChildRoutes } from '../../components';
import { MODULE_PATHS } from '../../content.const';
import { ContentRouteProps } from '../../content.types';
import { TenantContext } from '../../context';
import { useContentType, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import {
	ContentCreateSchema,
	ContentSchema,
	ContentStatus,
	createContent,
} from '../../services/content';
import { useInternalFacade } from '../../store/content/internal/internal.facade';

import { ContentCreateMatchProps } from './ContentCreate.types';

const ContentCreate: FC<ContentRouteProps<ContentCreateMatchProps>> = ({ match, routes }) => {
	const { contentTypeId, siteId } = match.params;

	/**
	 * Hooks
	 */
	const { generatePath, navigate } = useNavigate();
	const [contentTypesLoading, contentType] = useContentType(contentTypeId);
	const { tenantId } = useContext(TenantContext);
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content',
			target: '',
		},
		{
			name: 'Content aanmaken',
			target: generatePath(MODULE_PATHS.createOverview, {
				siteId,
			}),
		},
	]);
	const [, registerContent, activateContent] = useInternalFacade();
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

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
		navigate(MODULE_PATHS.overview, { siteId });
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

		const extraOptions = {
			contentType: contentType,
			onSubmit: (value: ContentSchema) => onFormSubmit(value),
			cancel: () => navigateToOverview(),
		};

		return (
			<div className="u-margin-top">
				<RenderChildRoutes
					routes={activeRoute?.routes}
					guardsMeta={guardsMeta}
					extraOptions={extraOptions}
				/>
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
