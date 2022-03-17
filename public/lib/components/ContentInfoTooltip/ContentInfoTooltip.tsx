import { CardTitle, Label } from '@acpaas-ui/react-components';
import { TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { DataLoader, InfoTooltip, LoadingState, useSiteContext } from '@redactie/utils';
import moment from 'moment';
import React, { ReactElement, useEffect, useState } from 'react';

import rolesRightsConnector from '../../connectors/rolesRights';
import { useContentItem } from '../../hooks';
import { contentApiService } from '../../services/content/content.service';
import { ContentMeta } from '../../services/content/content.service.types';

import { STATUS_TRANSLATION_MAP } from './ContentInfoTooltip.const';
import { ContentInfoTooltipProps, Status } from './ContentInfoTooltip.types';

const ContentInfoTooltip: React.FC<ContentInfoTooltipProps> = ({
	icon,
	contentId,
	className
}: ContentInfoTooltipProps) => {
	const { siteId } = useSiteContext();
	const [fetchingState] = useContentItem();
	const [item, setItem] = useState<ContentMeta>();
	const [initialLoading, setInitialLoading] = useState(true);
	const [mySecurityRightsLoading] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
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

	useEffect(() => {
		if (!siteId || !contentId) {
			return;
		}
		const fetchData = async (): Promise<void> => {
			const items = await contentApiService.getContentItem(siteId, contentId);
			setItem(items?.meta);
		};
		fetchData();
	}, [siteId, contentId]);

	const renderView = (): ReactElement | null => {
		if (!item) {
			return null;
		}
		return (
			<div className="tooltip">
				<div
					className={`status-indicator ${
						item?.published
							? 'status-indicator__published'
							: 'status-indicator__unpublished'
					}`}
				>
					•
				</div>

					<InfoTooltip placement="bottom-end" type={TooltipTypeMap.WHITE} icon={icon}>
						<CardTitle>{item?.label}</CardTitle>

						<div className="u-margin-top">
							{item?.description && (
								<div className="u-margin-bottom u-text-light">
									{item?.description}
								</div>
							)}
							{item?.created && (
								<div className="u-margin-bottom-xs">
									<b>Aangemaakt op: </b>
									<span>
										{moment(item?.created).format('DD/MM/YYYY [-] HH[u]mm')}
									</span>
								</div>
							)}
							{item?.lastModified && (
								<div className="u-margin-bottom-xs">
									<b>Laatst aangepast op: </b>
									{moment(item?.lastModified).format('DD/MM/YYYY [-] HH[u]mm')}
								</div>
							)}
							{item?.historySummary?.published && item?.firstPublished && (
								<div className="u-margin-bottom-xs">
									<b>Gepubliceerd op: </b>
									{moment(item?.firstPublished).format('DD/MM/YYYY [-] HH[u]mm')}
								</div>
							)}
							{item?.lastEditor && (
								<div className="u-margin-bottom-xs">
									<b>Door: </b>
									{`${item?.lastEditor?.firstname} ${item?.lastEditor?.lastname}`}
								</div>
							)}
							<div className="u-margin-top">
								<p>
									<b>Status</b>
								</p>
								<Label type="primary">
									{STATUS_TRANSLATION_MAP[item?.status as Status]}
								</Label>
							</div>
						</div>
					</InfoTooltip>

			</div>
		);
	};

	return (
		<div className={`dataloader ${className}`}>
			<DataLoader loadingState={initialLoading} render={renderView} notFoundMessage="" />
		</div>
	);
};
export default ContentInfoTooltip;
