import { Button, Card } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
	NavList,
} from '@acpaas-ui/react-editorial-components';
import { alertService, LeavePrompt, LoadingState, NavListItem, useNavigate } from '@redactie/utils';
import { FormikProps, FormikValues, setNestedObjectValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty, lensPath, path, set } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ContentSchema, ContentStatus } from '../../api/api.types';
import { ContentFormActions } from '../../components';
import sitesConnector from '../../connectors/sites';
import {
	ALERT_CONTAINER_IDS,
	CONTENT_MODAL_MAP,
	MODULE_PATHS,
	SITES_ROOT,
	WORKING_TITLE_KEY,
} from '../../content.const';
import {
	filterExternalCompartments,
	getCompartmentValue,
	getContentTypeCompartments,
	getSettings,
	getWorkTitleMapper,
	runAllSubmitHooks,
	validateCompartments,
} from '../../helpers/contentCompartments';
import {
	useContentAction,
	useContentCompartment,
	useContentLoadingStates,
	useExternalAction,
	useExternalCompartment,
} from '../../hooks';
import { contentFacade } from '../../store/content';
import {
	CompartmentType,
	ContentCompartmentModel,
	contentCompartmentsFacade,
} from '../../store/ui/contentCompartments';

import {
	CONTENT_ALERT_MAP,
	CONTENT_CREATE_ALLOWED_PATHS,
	CONTENT_EDIT_ALLOWED_PATHS,
	INTERNAL_COMPARTMENTS,
} from './ContentForm.const';
import { ContentFormMatchProps, ContentFormRouteProps } from './ContentForm.types';

const ContentForm: FC<ContentFormRouteProps<ContentFormMatchProps>> = ({
	history,
	contentType,
	contentItem,
	contentItemDraft,
	hasChanges,
	match,
	showPublishedStatus,
	showDeleteButton,
	isCreating = false,
	onSubmit = () => null,
	onCancel = () => null,
	onDelete,
	onStatusClick = () => null,
	onUpdatePublication = () => null,
}) => {
	const { compartment, contentTypeId, siteId, contentId } = match.params;

	/**
	 * Hooks
	 */
	const [
		{ compartments, active: activeCompartment },
		register,
		activate,
		validate,
		setActiveIsValid,
	] = useContentCompartment();
	const [externalCompartments] = useExternalCompartment();
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues> | null>();
	const [navList, setNavlist] = useState<NavListItem[]>([]);
	const [hasSubmit, setHasSubmit] = useState(false);
	const [slugFieldTouched, setSlugFieldTouched] = useState(false);
	const [
		,
		createContentItemLoadingState,
		updateContentItemLoadingState,
		publishContentItemLoadingState,
	] = useContentLoadingStates();
	const { navigate } = useNavigate(SITES_ROOT);
	const internalCompartments = useMemo(() => INTERNAL_COMPARTMENTS(siteId, contentType), [
		contentType,
		siteId,
	]);
	const workingTitleMapper = useMemo(() => getWorkTitleMapper(contentType), [contentType]);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [modalState, setModalState] = useState<{
		title: string;
		message: ReactElement;
		confirm: string;
		confirmButtonType?: string;
		confirmButtonIcon?: string;
		action?: string;
	}>();
	const [alertState, setAlertState] = useState<{
		type: 'danger' | 'warning';
		title: string;
		message: ReactElement;
		confirm?: string;
	}>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [{ actions }, registerAction] = useContentAction();
	const [externalActions] = useExternalAction();

	const navigateToPlanning = (): void => {
		navigate(`${MODULE_PATHS.detailEdit}/planning`, {
			siteId,
			contentId,
			contentTypeId,
		});
	};

	const getContentTitle = (title: string): string => {
		return title ? `'${title}'` : 'Content';
	};

	const getAlertState = (publishTime: string, unpublishTime: string): void => {
		if (publishTime && publishTime < new Date().toISOString()) {
			setAlertState(CONTENT_ALERT_MAP(publishTime).invalidPublishTime);
			return;
		}

		if (unpublishTime && unpublishTime < new Date().toISOString()) {
			setAlertState(CONTENT_ALERT_MAP(unpublishTime).invalidUnpublishTime);
			return;
		}

		if (publishTime) {
			setAlertState(CONTENT_ALERT_MAP(publishTime).publishTime);
			return;
		}

		if (unpublishTime) {
			setAlertState(CONTENT_ALERT_MAP(unpublishTime).unpublishTime);
			return;
		}
	};

	const getModalState = (status: string, publishTime?: string, unpublishTime?: string): void => {
		const title = getContentTitle(contentItemDraft?.meta.label);

		if (
			publishTime &&
			publishTime < new Date().toISOString() &&
			status !== ContentStatus.PUBLISHED
		) {
			setModalState(CONTENT_MODAL_MAP(title, unpublishTime).publish);
			return;
		}

		if (status === ContentStatus.UNPUBLISHED) {
			setModalState(CONTENT_MODAL_MAP(title, unpublishTime).unpublish);
			return;
		}

		if (unpublishTime && unpublishTime < new Date().toISOString()) {
			setModalState(CONTENT_MODAL_MAP(title, unpublishTime).publishWithInvalidUnpublishTime);
			return;
		}

		if (unpublishTime) {
			setModalState(CONTENT_MODAL_MAP(title, unpublishTime).publishWithUnpublishTime);
			return;
		}

		if (
			contentItem?.meta?.status === ContentStatus.DRAFT &&
			!!contentItem?.meta?.historySummary?.published
		) {
			setModalState(CONTENT_MODAL_MAP(title, undefined).updatePublication);
			return;
		}

		setModalState(CONTENT_MODAL_MAP(title, undefined).publish);
	};

	useEffect(() => {
		if (!contentType || !site) {
			return;
		}

		registerAction(
			externalActions.filter(action => {
				return action.show && action.show(contentType, site, contentItem);
			}),
			{ replace: true }
		);
	}, [contentType, externalActions]); // eslint-disable-line

	useEffect(() => {
		if (!contentType) {
			return;
		}

		register(
			[
				...(getContentTypeCompartments(contentType) as ContentCompartmentModel[]),
				...internalCompartments,
				...filterExternalCompartments(
					contentItemDraft,
					contentType,
					externalCompartments,
					isCreating
				),
			],
			{ replace: true }
		);
	}, [contentType, externalCompartments, internalCompartments]); // eslint-disable-line

	useEffect(() => {
		if (compartments.length && (!compartment || compartment === 'default')) {
			history.push(`./${compartments[0].slug || compartments[0].name}`);
			return;
		}

		activate(compartment);
	}, [activate, compartment, compartments, history]);

	useEffect(() => {
		setNavlist(
			compartments.map(compartment => ({
				activeClassName: 'is-active',
				label: compartment.label,
				description: compartment.getDescription
					? compartment.getDescription(contentItem)
					: '',
				to: compartment.slug || compartment.name,
				hasError: hasSubmit && compartment.isValid === false,
			}))
		);
	}, [compartments, contentItem, hasSubmit]);

	// Trigger errors on form when switching from compartments
	useEffect(() => {
		const { current: formikRef } = activeCompartmentFormikRef;

		if (hasSubmit && !activeCompartment?.isValid && formikRef) {
			formikRef.validateForm().then(errors => {
				if (!isEmpty(errors)) {
					// Set all fields with errors as touched
					formikRef.setTouched(setNestedObjectValues(errors, true));
					formikRef.setErrors(errors);
				}
			});
		}
	}, [activeCompartment, activeCompartmentFormikRef, hasSubmit]);

	useEffect(() => {
		if (!alertState) {
			return;
		}

		alertService.dismiss();

		if (alertState.type === 'danger') {
			alertService.danger(
				{
					title: alertState?.title,
					message: (
						<>
							{alertState?.message}
							<div className="row end-xs u-margin-top">
								<Button
									outline
									type="danger"
									className="u-margin-right-xs"
									onClick={navigateToPlanning}
								>
									Herbekijk planning
								</Button>
								<Button
									type="danger"
									onClick={() => {
										getModalState(
											ContentStatus.UNPUBLISHED,
											(contentItem?.meta.publishTime as string) ?? undefined,
											(contentItem?.meta.unpublishTime as string) ?? undefined
										);
										setShowConfirmModal(true);
									}}
								>
									{alertState?.confirm}
								</Button>
							</div>
						</>
					),
				},
				{
					containerId: ALERT_CONTAINER_IDS.contentEdit,
				}
			);
			return;
		}

		alertService.warning(
			{
				title: alertState?.title,
				message: (
					<>
						{alertState?.message}
						<div className="row end-xs u-margin-top">
							<Button
								outline
								type="warning"
								className="u-margin-right-xs"
								onClick={() => alertService.dismiss()}
							>
								Behoud datum
							</Button>
							<Button type="warning" onClick={navigateToPlanning}>
								Bekijk planning
							</Button>
						</div>
					</>
				),
			},
			{
				containerId: ALERT_CONTAINER_IDS.contentEdit,
			}
		);
	}, [alertState]); // eslint-disable-line

	useEffect(() => {
		if (
			(!contentItem?.meta.publishTime && !contentItem?.meta.unpublishTime) ||
			(contentItem?.meta.status === ContentStatus.PUBLISHED && contentItem?.meta.publishTime)
		) {
			return;
		}

		getAlertState(
			contentItem?.meta.publishTime as string,
			contentItem?.meta.unpublishTime as string
		);
	}, [contentItem]); // eslint-disable-line

	/**
	 * Methods
	 */
	const handleChange = (compartment: ContentCompartmentModel, values: unknown): void => {
		if (!contentItemDraft) {
			return;
		}

		if (hasSubmit) {
			const { current: formikRef } = activeCompartmentFormikRef;

			setActiveIsValid(isEmpty(formikRef?.errors));
		}

		switch (compartment.type) {
			case CompartmentType.CT: {
				const fieldValues = values as ContentSchema['fields'];

				if (isCreating && !slugFieldTouched && contentType?.meta?.canBeFiltered) {
					const workingTitlePath = workingTitleMapper
						? [workingTitleMapper.field.name, ...workingTitleMapper.mapper.sourcePath]
						: [WORKING_TITLE_KEY];

					contentFacade.updateContentMetaDraft({
						slug: { nl: kebabCase(path(workingTitlePath, fieldValues)) },
					});
				}

				contentFacade.updateContentFieldsDraft(fieldValues);

				break;
			}
			case CompartmentType.INTERNAL: {
				const metaValues = values as ContentSchema['meta'];

				if (isCreating && !isEmpty(metaValues.slug?.nl)) {
					setSlugFieldTouched(true);
				}

				contentFacade.updateContentMetaDraft(metaValues);

				break;
			}
			case CompartmentType.MODULE:
				contentFacade.updateContentModuleDraft(compartment.name, values);
				break;
		}

		return;
	};

	const handleCancel = (): void => {
		const { current: formikRef } = activeCompartmentFormikRef;

		if (formikRef) {
			formikRef.resetForm();
		}

		alertService.dismiss();
		setHasSubmit(false);
		onCancel();
	};

	const setContentLoading = (isLoading: boolean): void => {
		if (isCreating) {
			contentFacade.setIsCreating(isLoading);
		} else {
			contentFacade.setIsUpdating(isLoading);
		}
	};

	const onFormSubmit = async (contentItemDraft: ContentSchema): Promise<void> => {
		setContentLoading(true);
		setHasSubmit(true);

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = await validateCompartments(
			activeCompartment as ContentCompartmentModel,
			compartments,
			contentItemDraft,
			validate,
			{ async: false }
		).catch(() => setContentLoading(false));

		// Validate current form to trigger fields error states
		if (formikRef) {
			formikRef.validateForm().then(errors => {
				if (!isEmpty(errors)) {
					formikRef.setErrors(errors);
				}
			});
		}

		if (!compartmentsAreValid || !activeCompartment) {
			setContentLoading(false);
			return;
		}

		const kebabCasedSlugs = contentItemDraft.meta.activeLanguages.reduce((acc, lang) => {
			if (!contentItemDraft.meta.slug[lang]) {
				return acc;
			}
			return {
				...acc,
				[lang]: kebabCase(contentItemDraft.meta.slug[lang]),
			};
		}, {});

		const slugLens = lensPath(['meta', 'slug']);
		const modifiedContentItemDraft = set(slugLens, kebabCasedSlugs, contentItemDraft);

		runAllSubmitHooks(
			compartments,
			contentType,
			modifiedContentItemDraft,
			contentItem,
			'beforeSubmit'
		).then(({ hasRejected, errorMessages, contentItem }) => {
			if (!hasRejected) {
				onSubmit(contentItem, activeCompartment, compartments);
				return;
			}

			setContentLoading(false);

			errorMessages.forEach(message => {
				contentCompartmentsFacade.setValid(message.compartmentName, false);
			});

			alertService.danger(
				{
					title: 'Er zijn nog fouten',
					message: (
						<>
							<ul className="a-list">
								{errorMessages.map((error, index) => (
									<li key={index}>{error.error.message}</li>
								))}
							</ul>
						</>
					),
				},
				{
					containerId: isCreating
						? ALERT_CONTAINER_IDS.contentCreate
						: ALERT_CONTAINER_IDS.contentEdit,
				}
			);
		});

		setHasSubmit(true);
	};

	const onDeleteModal = (): void => {
		const title = getContentTitle(contentItemDraft?.meta.label);
		setModalState(CONTENT_MODAL_MAP(title, undefined).remove);
		setShowConfirmModal(true);
	};

	const onPublishPromptCancel = (): void => {
		setShowConfirmModal(false);
	};

	const onPublishPromptConfirm = async (): Promise<void> => {
		setIsSubmitting(true);

		if (modalState?.action === 'remove') {
			onDelete()
				.then(() => {
					navigate(MODULE_PATHS.overview, {
						siteId,
					});
				})
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.catch(() => {})
				.finally(() => {
					setIsSubmitting(false);
					setShowConfirmModal(false);
				});

			return;
		}

		if (
			contentItem?.meta?.status === ContentStatus.DRAFT &&
			contentItemDraft?.meta?.status !== ContentStatus.UNPUBLISHED &&
			!!contentItem?.meta?.historySummary?.published
		) {
			onUpdatePublication(contentItemDraft);
			setIsSubmitting(false);
			setShowConfirmModal(false);
			return;
		}

		let data = contentItemDraft;

		if (
			(contentItemDraft?.meta.unpublishTime &&
				contentItemDraft?.meta.unpublishTime < new Date().toISOString()) ||
			contentItemDraft?.meta.status === ContentStatus.UNPUBLISHED
		) {
			data = {
				...data,
				meta: {
					...data.meta,
					publishTime: null,
					unpublishTime: null,
					status: ContentStatus.UNPUBLISHED,
				},
			};
		} else {
			data = {
				...data,
				meta: {
					...data.meta,
					publishTime: null,
					status:
						contentItemDraft.meta.unpublishTime &&
						contentItemDraft.meta.unpublishTime < new Date().toISOString()
							? ContentStatus.UNPUBLISHED
							: ContentStatus.PUBLISHED,
				},
			};
		}

		await onFormSubmit(data);
		setIsSubmitting(false);
		setShowConfirmModal(false);
	};

	const onSave = (): void => {
		if (
			(contentItemDraft?.meta.status !== ContentStatus.PUBLISHED &&
				contentItemDraft?.meta.status !== ContentStatus.UNPUBLISHED) ||
			(contentItemDraft?.meta.status === ContentStatus.PUBLISHED &&
				contentItem?.meta.status === ContentStatus.PUBLISHED)
		) {
			onFormSubmit(contentItemDraft);
			return;
		}

		getModalState(
			contentItemDraft?.meta.status,
			(contentItem?.meta.publishTime as string) ?? undefined,
			(contentItem?.meta.unpublishTime as string) ?? undefined
		);

		setShowConfirmModal(true);
	};

	const updatePublication = (): void => {
		getModalState(
			contentItemDraft?.meta.status,
			(contentItem?.meta.publishTime as string) ?? undefined,
			(contentItem?.meta.unpublishTime as string) ?? undefined
		);

		setShowConfirmModal(true);
	};

	if (!activeCompartment && compartment !== 'default') {
		if (isCreating) {
			navigate(`${MODULE_PATHS.create}/default`, { siteId, contentTypeId });
		} else {
			navigate(`${MODULE_PATHS.detailEdit}/default`, { siteId, contentTypeId, contentId });
		}
	}

	if (!activeCompartment) {
		return null;
	}

	/**
	 * RENDER
	 */
	return (
		<>
			<div className="row between-xs top-xs u-margin-bottom-lg">
				<div className="col-xs-12 col-md-3 u-margin-bottom">
					<NavList linkComponent={NavLink} items={navList} />
				</div>

				<div className="col-xs-12 col-md-9">
					<Card>
						<activeCompartment.component
							formikRef={instance => {
								if (!equals(instance, activeCompartmentFormikRef.current)) {
									activeCompartmentFormikRef.current = instance;
								}
							}}
							contentType={contentType}
							contentValue={contentItemDraft}
							contentItem={contentItem}
							isCreating={isCreating}
							isValid
							settings={getSettings(contentType, activeCompartment)}
							onChange={values => handleChange(activeCompartment, values)}
							value={getCompartmentValue(
								contentItemDraft,
								activeCompartment,
								contentType
							)}
							updateContent={(content: ContentSchema) =>
								contentFacade.updateContentItemDraft(content)
							}
						/>
					</Card>
				</div>
			</div>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<ContentFormActions
						actions={actions}
						contentItem={contentItemDraft || contentItem}
						site={site}
						isPublished={!!contentItem?.meta?.historySummary?.published}
						isSaved={!hasChanges}
						status={contentItem?.meta?.status}
						onStatusClick={onStatusClick}
						onSave={onSave}
						onDelete={onDeleteModal}
						showPublishedStatus={showPublishedStatus}
						showDeleteButton={showDeleteButton}
						isSaving={
							updateContentItemLoadingState === LoadingState.Loading ||
							createContentItemLoadingState === LoadingState.Loading
						}
						isPublishing={publishContentItemLoadingState === LoadingState.Loading}
						onUpdatePublication={updatePublication}
						onCancel={handleCancel}
					/>
				</ActionBarContentSection>
			</ActionBar>
			<ControlledModal show={showConfirmModal} onClose={onPublishPromptCancel} size="large">
				<ControlledModalHeader>
					<h4>{modalState?.title}</h4>
				</ControlledModalHeader>
				<ControlledModalBody>{modalState?.message}</ControlledModalBody>
				<ControlledModalFooter>
					<div className="u-flex u-flex-item u-flex-justify-end">
						<Button onClick={onPublishPromptCancel} negative>
							Annuleer
						</Button>
						{contentItemDraft?.meta.unpublishTime &&
							contentItemDraft.meta.status === ContentStatus.PUBLISHED && (
								<Button
									type="warning"
									onClick={() => {
										setShowConfirmModal(false);
										navigateToPlanning();
									}}
								>
									Bekijk planning
								</Button>
							)}
						<Button
							iconLeft={
								isSubmitting
									? 'circle-o-notch fa-spin'
									: modalState?.confirmButtonIcon
							}
							disabled={isSubmitting}
							onClick={onPublishPromptConfirm}
							type={modalState?.confirmButtonType || 'success'}
						>
							{modalState?.confirm}
						</Button>
					</div>
				</ControlledModalFooter>
			</ControlledModal>
			<LeavePrompt
				allowedPaths={
					isCreating ? CONTENT_CREATE_ALLOWED_PATHS : CONTENT_EDIT_ALLOWED_PATHS
				}
				when={hasChanges}
				shouldBlockNavigationOnConfirm
				onConfirm={() => onFormSubmit(contentItemDraft)}
			/>
		</>
	);
};

export default ContentForm;
