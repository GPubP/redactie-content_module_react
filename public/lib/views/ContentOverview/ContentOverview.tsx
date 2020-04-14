import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS } from '../../content.const';
import { ContentRouteProps, LoadingState } from '../../content.types';
import { useRoutes } from '../../hooks';
import { ContentSchema, getContent } from '../../services/content';
import './ContentOverview.scss';

const ContentOverview: FC<ContentRouteProps<{ siteId: string }>> = ({
	tenantId,
	match,
	history,
}) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contents, setContent] = useState<ContentSchema[] | null>(null);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

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
			title: content.meta?.label,
			type: content.meta?.contentType?.meta?.label,
			publication: content.meta?.lastModified,
			author: content.meta?.lastEditor,
			status: content.meta?.status,
			online: content.meta?.published,
		}));

		const contentsColumns = [
			{
				label: 'Titel',
				value: 'title',
			},
			{
				label: 'Type',
				value: 'type',
			},
			{
				label: 'Publicatiedatum',
				value: 'publication',
				format: (data: string) => moment(data).format('DD/MM/YYYYY [-] hh[u]mm'),
			},
			{
				label: 'Auteur',
				value: 'author',
			},
			{
				label: 'Status',
				value: 'status',
			},
			{
				label: 'Online',
				value: 'online',
				component(value: string, rowData: any) {
					// TODO: fix any type
					const isOnline = !!rowData['online'];
					return isOnline ? (
						<span className="a-dot__green"></span>
					) : (
						<span className="a-dot__red"></span>
					);
				},
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
							onClick={() =>
								history.push(`/${tenantId}/sites/${siteId}/content/${id}/bewerken`)
							}
							type="primary"
							transparent
						></Button>
					);
				},
			},
		];

		return (
			<>
				<h5 className="u-margin-bottom">Resultaat ({contentsRows.length})</h5>
				<Table rows={contentsRows} columns={contentsColumns} />
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Content overzicht">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button
						onClick={() =>
							history.push(
								`/${tenantId}/sites/${siteId}/content/content-type/46bf8fd1-895f-4d6e-84be-e26f8c5a6fcb/aanmaken`
							)
						}
						iconLeft="plus"
					>
						Nieuwe maken
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={loadingState} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentOverview;
