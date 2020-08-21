import { Link as AuiLink, Button, Card, CardBody, CardTitle } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import moment from 'moment';
import { isEmpty } from 'ramda';
import React, { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { PublishedStatus } from '../../components';
import { getView } from '../../connectors/formRenderer';
import { MODULE_PATHS } from '../../content.const';
import { getViewPropsByCT } from '../../helpers';
import { useNavigate } from '../../hooks';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import './ContentDetailView.scss';

const ContentDetailView: FC<ContentDetailChildRouteProps> = ({
	contentItemDraft,
	contentType,
	match,
}) => {
	const { meta } = contentItemDraft;
	const { siteId, contentId } = match.params;
	const View = getView();

	/**
	 * Hooks
	 */
	const { navigate, generatePath } = useNavigate();
	const viewProps = useMemo(() => getViewPropsByCT(contentType, contentItemDraft.fields), [
		contentType,
		contentItemDraft.fields,
	]);
	const contentItemIsEmpty = useMemo(() => isEmpty(contentItemDraft.fields || {}), [
		contentItemDraft.fields,
	]);

	/**
	 * Methods
	 */
	const goToDetailEdit = (): void => {
		navigate(`${MODULE_PATHS.detailEdit}/default`, {
			siteId,
			contentId,
		});
	};

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
					{contentItemIsEmpty && (
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
					)}
					{View && !contentItemIsEmpty && <View {...viewProps} />}
				</div>
			</div>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<div className="button-group">
							<Button onClick={goToDetailEdit}>Bewerken</Button>
						</div>
						<PublishedStatus
							published={!!contentItemDraft.meta.historySummary?.published}
						/>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);
};

export default ContentDetailView;