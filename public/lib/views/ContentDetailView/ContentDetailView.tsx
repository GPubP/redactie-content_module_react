import { Link as AuiLink, Card, CardBody, CardTitle } from '@acpaas-ui/react-components';
import moment from 'moment';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { MODULE_PATHS } from '../../content.const';
import { useNavigate } from '../../hooks';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import './ContentDetailView.scss';

const ContentDetailView: FC<ContentDetailChildRouteProps> = ({ contentItemDraft, match }) => {
	const { meta } = contentItemDraft;
	const { siteId, contentId } = match.params;

	/**
	 * Hooks
	 */
	const { generatePath } = useNavigate();

	return (
		<>
			<div className="row between-xs top-xs u-margin-bottom-lg">
				<div className="col-xs-4 u-padding">
					<Card>
						<CardBody>
							<CardTitle>{meta.label}</CardTitle>

							<div className="u-margin-top">
								{meta.slug && (
									<div className="u-margin-bottom-xs">
										<b>Slug: </b>
										{meta.slug.nl}
									</div>
								)}
								{meta.created && (
									<div className="u-margin-bottom-xs">
										<b>Aangemaakt op: </b>
										{moment(meta.created).format('DD/MM/YYYY [-] hh[u]mm')}
									</div>
								)}
								{meta.lastModified && (
									<div>
										<b>Laatst aangepast op: </b>
										{moment(meta.lastModified).format('DD/MM/YYYY [-] hh[u]mm')}
									</div>
								)}
							</div>
						</CardBody>
					</Card>
				</div>
				<div className="col-xs-8">
					<div className="empty-state">
						<div className="empty-state__content">
							<p>Er is nog geen inhoud voor dit item</p>
							<AuiLink
								to={generatePath(`${MODULE_PATHS.detailEdit}/default`, {
									siteId,
									contentId,
								})}
								component={Link}
							>
								Begin met bewerken
							</AuiLink>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ContentDetailView;
