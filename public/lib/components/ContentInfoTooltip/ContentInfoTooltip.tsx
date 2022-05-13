import { CardTitle, Label } from '@acpaas-ui/react-components';
import { TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import {
	DataLoader,
	InfoTooltip,
	LoadingState,
	useNavigate,
	useSiteContext,
} from '@redactie/utils';
import moment from 'moment';
import { path } from 'ramda';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import formRendererConnector from '../../connectors/formRenderer';
import rolesRightsConnector from '../../connectors/rolesRights';
import { useContentItem } from '../../hooks';
import {
	CONTENT_STATUS_TRANSLATION_MAP,
	ContentSchema,
	ContentStatus,
} from '../../services/content';
import { contentApiService } from '../../services/content/content.service';

import { ContentInfoTooltipProps } from './ContentInfoTooltip.types';

import './ContentInfoTooltip.scss';

const ContentInfoTooltip: React.FC<ContentInfoTooltipProps> = ({
	icon,
	contentId,
	className,
	site,
}: ContentInfoTooltipProps) => {
	const { activeLanguage } = useContext(formRendererConnector.api.FormContext);
	const { siteId } = useSiteContext();
	const { generatePath } = useNavigate('sites');

	const url =
		typeof site?.data?.url === 'object'
			? site?.data?.url[activeLanguage || 'nl']
			: site?.data?.url;
	const newSite = url?.slice(-1) === '/' ? url.slice(0, url.length - 1) : url;
	const [fetchingState] = useContentItem();
	const [item, setItem] = useState<ContentSchema>();
	const [initialLoading, setInitialLoading] = useState(true);
	const [mySecurityRightsLoading] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: site?.uuid || siteId,
		onlyKeys: false,
	});

	useEffect(() => {
		if (
			initialLoading &&
			fetchingState !== LoadingState.Loading &&
			mySecurityRightsLoading !== LoadingState.Loading &&
			item &&
			contentId
		) {
			setInitialLoading(false);
		}
	}, [fetchingState, mySecurityRightsLoading, initialLoading, item, contentId]);

	const contentItemPath = item ? generatePath(
		'/:siteId/content/content-types/:contentTypeId/content/:contentId',
		{
			siteId: siteId || '',
			contentTypeId: item?.meta.contentType.uuid,
			contentId: item?.uuid,
		}
	): '';

	useEffect(() => {
		if (!site?.uuid || !contentId) {
			return;
		}

		const fetchData = async (): Promise<void> => {
			await contentApiService
				.getContentItemBySlug(site.uuid, contentId)
				.then(item => setItem(item));
		};

		fetchData();
	}, [contentId, site]);

	const handleVisibilityChange = (isVisible: boolean): void => {
		console.log(isVisible);
	};

	const renderView = (): ReactElement | null => {
		if (!item) {
			return null;
		}
		return (
			<div className="m-tooltip-container">
				<div
					className={`a-dot ${
						item?.meta.published ? 'a-dot__published' : 'a-dot__unpublished'
					}`}
				>
					•
				</div>
				<InfoTooltip
					placement="bottom-end"
					type={TooltipTypeMap.WHITE}
					icon={icon}
					onVisibilityChange={handleVisibilityChange}
				>
					<CardTitle>
						<Link className="m-tooltip__title" to={contentItemPath}>
							{item?.meta.label && item?.meta.label}
						</Link>
					</CardTitle>

					<div className="u-margin-top">
						{item?.meta.description && (
							<div className="u-margin-bottom u-text-light a-description">
								{item?.meta.description}
							</div>
						)}
						{path(['meta', 'urlPath', item?.meta.lang, 'value'])(item) && (
							<div className="u-margin-bottom-xs a-url">
								<b>URL: </b>
								{`${newSite}${item?.meta.urlPath![item?.meta.lang]?.value}`}
							</div>
						)}
						{item?.meta.created && (
							<div className="u-margin-bottom-xs">
								<b>Aangemaakt op: </b>
								<span>
									{moment(item?.meta.created).format('DD/MM/YYYY [-] HH[u]mm')}
								</span>
							</div>
						)}
						{item?.meta.lastEditor && (
							<div className="u-margin-bottom-xs">
								<b>Door: </b>
								{`${item?.meta.lastEditor?.firstname} ${item?.meta.lastEditor?.lastname}`}
							</div>
						)}
						<div className="u-margin-top">
							<p>
								<b>Status</b>
							</p>
							{item?.meta.status && (
								<Label type="primary">
									{
										CONTENT_STATUS_TRANSLATION_MAP[
											item?.meta.status as ContentStatus
										]
									}
								</Label>
							)}

							{item?.meta.historySummary?.published ? (
								<Label
									className="u-margin-left-xs u-margin-top-xs u-margin-bottom-xs"
									type="success"
								>
									Online
								</Label>
							) : (
								<Label
									className="u-margin-left-xs u-margin-top-xs u-margin-bottom-xs"
									type="danger"
								>
									Offline
								</Label>
							)}
						</div>
					</div>
				</InfoTooltip>
			</div>
		);
	};

	return (
		<div className={`m-dataloader-container ${className}`}>
			<DataLoader loadingState={initialLoading} render={renderView} notFoundMessage="" />
		</div>
	);
};
export default ContentInfoTooltip;
