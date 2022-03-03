import { CardTitle, Label } from '@acpaas-ui/react-components';
import moment from 'moment';
import React, { FC } from 'react';

import { ContentInfoTooltipProps, Status } from './ContentInfoTooltip.types';
import { STATUS_TRANSLATION_MAP } from './ContentInfoTooltip.const';
import { InfoTooltip } from '@redactie/utils'
import { TooltipTypeMap } from '@acpaas-ui/react-editorial-components';

const ContentInfoTooltip: FC<ContentInfoTooltipProps> = ({ meta, icon }) => {

	return (
		<InfoTooltip placement="bottom-end" type={TooltipTypeMap.WHITE} icon={icon}>
			<CardTitle>{meta.label}</CardTitle>

			<div className="u-margin-top">
				{meta?.description && (
					<div className="u-margin-bottom u-text-light">{meta.description}</div>
				)}
				{meta?.created && (
					<div className="u-margin-bottom-xs">
						<b>Aangemaakt op: </b>
						<span>{moment(meta.created).format('DD/MM/YYYY [-] HH[u]mm')}</span>
					</div>
				)}
				{meta?.lastModified && (
					<div className="u-margin-bottom-xs">
						<b>Laatst aangepast op: </b>
						{moment(meta.lastModified).format('DD/MM/YYYY [-] HH[u]mm')}
					</div>
				)}
				{meta?.historySummary?.published && meta.firstPublished && (
					<div className="u-margin-bottom-xs">
						<b>Gepubliceerd op: </b>
						{moment(meta.firstPublished).format('DD/MM/YYYY [-] HH[u]mm')}
					</div>
				)}
				{meta?.lastEditor && (
					<div className="u-margin-bottom-xs">
						<b>Door: </b>
						{`${meta.lastEditor?.firstname} ${meta.lastEditor?.lastname}`}
					</div>
				)}
				<div className="u-margin-top">
					<p>
						<b>Status</b>
					</p>
					<Label type="primary">{STATUS_TRANSLATION_MAP[meta.status as Status]}</Label>
				</div>
			</div>
		</InfoTooltip>
	);
};

export default ContentInfoTooltip;
