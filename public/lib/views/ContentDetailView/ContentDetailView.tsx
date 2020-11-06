import { Link as AuiLink, Button, Card, CardBody, CardTitle } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { useWorker } from '@redactie/utils';
import moment from 'moment';
import { isEmpty } from 'ramda';
import React, { FC, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { PublishedStatus } from '../../components';
import { getView } from '../../connectors/formRenderer';
import { DATE_FORMATS, MODULE_PATHS } from '../../content.const';
import { getViewPropsByCT } from '../../helpers';
import { useLock, useNavigate } from '../../hooks';
import { LockModel, locksFacade } from '../../store/locks';
import { LockWorkerData } from '../../workers/pollGetLock/pollGetLock.types';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import './ContentDetailView.scss';

const ContentDetailView: FC<ContentDetailChildRouteProps> = ({
	contentItemDraft,
	contentType,
	match,
	tenantId,
}) => {
	const { meta } = contentItemDraft;
	const { siteId, contentId } = match.params;
	const View = getView();

	/**
	 * Hooks
	 */
	const { navigate, generatePath } = useNavigate();
	const [, , externalLock, userLock] = useLock(contentId);
	const viewProps = useMemo(() => getViewPropsByCT(contentType, contentItemDraft.fields), [
		contentType,
		contentItemDraft.fields,
	]);
	const contentItemIsEmpty = useMemo(() => isEmpty(contentItemDraft.fields || {}), [
		contentItemDraft.fields,
	]);
	const workerData = useMemo(
		() =>
			({
				siteId,
				tenantId,
				expiresAt: externalLock?.expireAt || null,
				lockId: contentId,
			} as LockWorkerData),
		[contentId, externalLock?.expireAt, userLock?.expireAt, siteId, tenantId] // eslint-disable-line react-hooks/exhaustive-deps
	);
	const [refreshedLock] = useWorker<LockWorkerData, LockModel>(
		BFF_MODULE_PUBLIC_PATH,
		'pollGetLock.worker',
		workerData
	);

	useEffect(() => {
		locksFacade.setLockValue(contentId, refreshedLock);
	}, [contentId, refreshedLock]);

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
										{moment(meta.created).format(DATE_FORMATS.dateAndTime)}
									</div>
								)}
								{meta.lastModified && (
									<div>
										<b>Laatst aangepast op: </b>
										{moment(meta.lastModified).format(DATE_FORMATS.dateAndTime)}
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
