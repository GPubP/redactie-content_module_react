import { Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS } from '../../content.const';
import { getContent } from '../../content.service';
import { ContentRouteProps, ContentSchema, LoadingState } from '../../content.types';
import { useRoutes } from '../../hooks';
import './ContentOverview.scss';

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
					console.log(data);
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
				format(data: string) {
					console.log(data);
					return moment(data).format('DD/MM/YYYYY [-] hh[u]mm');
				},
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
				component(value: 'online') {
					return value ? (
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
