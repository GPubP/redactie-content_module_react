import { Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS } from '../../content.const';
import { getContent } from '../../content.service';
import { ContentRouteProps, ContentSchema, LoadingState } from '../../content.types';
import { useRoutes } from '../../hooks';

const ContentOverview: FC<ContentRouteProps> = ({ basePath }) => {
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contents, setContent] = useState<ContentSchema[] | null>(null);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const history = useHistory();

	useEffect(() => {
		getContent()
			.then(data => {
				if (data?.length) {
					setContent(data);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, []);
	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!contents) {
			return null;
		}

		const contentsRows = contents.map(content => ({
			id: content.uuid,
			title: content.meta.title,
			description: content.meta.description,
		}));

		const contentsColumns = [
			{
				label: 'Titel',
				value: 'title',
			},
			{
				label: 'Type',
				value: 'type',
				disableSorting: true,
			},
			{
				label: 'Publicatiedatum',
				value: 'publicationDate',
				disableSorting: true,
			},
			{
				label: 'Auteur',
				value: 'author',
				disableSorting: true,
			},
			{
				label: 'Status',
				value: 'status',
				disableSorting: true,
			},
			{
				label: '',
				classList: ['u-text-right'],
				disableSorting: true,
				component(value: unknown, rowData: unknown) {
					// TODO: add types for rowData
					const { id } = rowData as any;

					return (
						<Button
							ariaLabel="Edit"
							icon="edit"
							onClick={() => history.push(`${basePath}/${id}/bewerken`)}
							type="primary"
							transparent
						></Button>
					);
				},
			},
		];

		return (
			<div className="u-container u-wrapper">
				<h5 className="u-margin-top">Resultaat ({contentsRows.length})</h5>
				<Table className="u-margin-top" rows={contentsRows} columns={contentsColumns} />
			</div>
		);
	};

	return (
		<>
			<ContextHeader title="Content overzicht">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus">Nieuwe maken</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<DataLoader loadingState={loadingState} render={renderOverview} />
		</>
	);
};

export default ContentOverview;
