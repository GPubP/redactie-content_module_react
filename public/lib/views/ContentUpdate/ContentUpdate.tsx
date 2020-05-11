import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { ContentRouteProps, LoadingState } from '../../content.types';
import { getFormPropsByCT } from '../../helpers';
import { useContentItem, useContentType, useRoutesBreadcrumbs } from '../../hooks';
import { ContentSchema, updateContent } from '../../services/content';

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
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content',
			target: '',
		},
	]);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = useCoreTranslation();

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
				meta: {
					...contentItem.meta,
					site: siteId,
				},
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
							htmlType="submit"
						>
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
						<Button onClick={navigateToOverview} outline>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
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
