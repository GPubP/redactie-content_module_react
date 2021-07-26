import {
	Link as AuiLink,
	Button,
	Card,
	CardBody,
	CardTitle,
	Label,
} from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer, useNavigate, useWorker } from '@redactie/utils';
import moment from 'moment';
import { isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { PublishedStatus } from '../../components';
import { getView } from '../../connectors/formRenderer';
import { contentFacade } from '../../store/content';
import sitesConnector from '../../connectors/sites';
import { ALERT_CONTAINER_IDS, CONTENT_MODAL_MAP, DATE_FORMATS, MODULE_PATHS, SITES_ROOT } from '../../content.const';
import { getViewPropsByCT } from '../../helpers';
import { useContentAction, useExternalAction, useLock } from '../../hooks';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';
import { LockModel, locksFacade } from '../../store/locks';
import { LockWorkerData } from '../../workers/pollGetLock/pollGetLock.types';
import { ContentDetailChildRouteProps } from '../ContentDetail/ContentDetail.types';

import './ContentDetailView.scss';

const ContentDetailView: FC<ContentDetailChildRouteProps> = ({
	contentItem,
	contentType,
	match,
	tenantId,
	canUpdate,
	canDelete,
}) => {
	const { meta } = contentItem;
	const { siteId, contentId } = match.params;
	const View = getView();

	/**
	 * Hooks
	 */
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const [, , externalLock, userLock] = useLock(contentId);
	const viewProps = useMemo(() => getViewPropsByCT(contentType, contentItem.fields), [
		contentType,
		contentItem.fields,
	]);
	const contentItemIsEmpty = useMemo(() => isEmpty(contentItem.fields || {}), [
		contentItem.fields,
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
	const [{ actions }, register] = useContentAction();
	const [externalActions] = useExternalAction();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalState, setModalState] = useState<{
		title: string;
		message: ReactElement;
		confirm: string;
		confirmButtonType?: string;
		confirmButtonIcon?: string;
		action?: string;
	}>();

	const [site] = sitesConnector.hooks.useSite(siteId);

	useEffect(() => {
		if (!contentType || !site) {
			return;
		}

		register(
			externalActions.filter(action => {
				return action.show && action.show(contentType, site);
			}),
			{ replace: true }
		);
	}, [contentType, externalActions]); // eslint-disable-line

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

	const getContentTitle = (title: string): string => {
		return title ? `'${title}'` : 'Content';
	};

	const onPromptCancel = (): void => {
		setShowConfirmModal(false);
	};

	const onDeleteModal = (): void => {
		const title = getContentTitle(contentItem?.meta.label);
		setModalState(CONTENT_MODAL_MAP(title, undefined).remove);
		setShowConfirmModal(true);
	}

	const onConfirm = (): void => {
		setIsSubmitting(true);
		
		contentFacade
			.removeContentItem(siteId, contentItem?.uuid!, contentItem)
			.then(() => {
				navigate(MODULE_PATHS.overview, {
					siteId,
				});
			})
			.catch(() => {})
			.finally(() => {
				setIsSubmitting(false);
				setShowConfirmModal(false);
			});
	}

	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.contentEdit}
			/>
			<div className="row between-xs top-xs u-margin-bottom-lg">
				<div className="col-xs-12 col-md-4">
					<Card>
						<CardBody>
							<CardTitle>{meta.label}</CardTitle>

							<div className="u-margin-top">
								{meta.description && (
									<div className="u-margin-bottom u-text-light">
										{meta.description}
									</div>
								)}
								{meta.slug && (
									<div>
										<b>Slug: </b>
										{meta.slug.nl}
									</div>
								)}
								{meta.created && (
									<div>
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
								{meta.historySummary?.published && meta.firstPublished && (
									<div>
										<b>Gepubliceerd op: </b>
										{moment(meta.firstPublished).format(
											DATE_FORMATS.dateAndTime
										)}
									</div>
								)}
								{meta.lastEditor && (
									<div>
										<b>Door: </b>
										{`${meta.lastEditor?.firstname} ${meta.lastEditor?.lastname}`}
									</div>
								)}
								{meta.status && (
									<div className="u-margin-top">
										<p>
											<b>Status</b>
										</p>
										<Label type="primary">
											{
												CONTENT_STATUS_TRANSLATION_MAP[
													meta.status as ContentStatus
												]
											}
										</Label>
									</div>
								)}
							</div>
						</CardBody>
					</Card>
				</div>
				<div className="col-xs-12 col-md-8">
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
					{View && !contentItemIsEmpty && (
						<>
							{meta.label && <h2 className="u-margin-bottom h3">{meta.label}</h2>}
							<View {...viewProps} />
						</>
					)}
				</div>
			</div>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						{canUpdate && <Button onClick={goToDetailEdit}>Bewerken</Button>}
						{actions.map((action, index) => (
							<div className="u-margin-left-xs" key={index}>
								<action.component />
							</div>
						))}
						{canDelete && (
							<div className="u-margin-left-xs">
								<Button
									onClick={onDeleteModal}
									icon="trash-o"
									ariaLabel="Delete"
									type="warning"
									htmlType="button"
									negative
								/>
							</div>
						)}

						<PublishedStatus published={!!meta.historySummary?.published} />
					</div>
				</ActionBarContentSection>
			</ActionBar>
			<ControlledModal show={showConfirmModal} onClose={onPromptCancel} size="large">
				<ControlledModalHeader>
					<h4>{modalState?.title}</h4>
				</ControlledModalHeader>
				<ControlledModalBody>{modalState?.message}</ControlledModalBody>
				<ControlledModalFooter>
					<div className="u-flex u-flex-item u-flex-justify-end">
						<Button onClick={onPromptCancel} negative>
							Annuleer
						</Button>
						<Button
							iconLeft={isSubmitting ? 'circle-o-notch fa-spin' : modalState?.confirmButtonIcon}
							disabled={isSubmitting}
							onClick={onConfirm}
							type={modalState?.confirmButtonType || 'success'}
						>
							{modalState?.confirm}
						</Button>
					</div>
				</ControlledModalFooter>
			</ControlledModal>
		</>
	);
};

export default ContentDetailView;
