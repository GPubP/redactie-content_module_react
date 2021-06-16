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
import moment from 'moment';
import { equals, isEmpty, lensPath, path, set } from 'ramda';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ContentSchema, ContentStatus } from '../../api/api.types';
import { ContentFormActions } from '../../components';
import {
	ALERT_CONTAINER_IDS,
	DATE_FORMATS,
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
	useContentCompartment,
	useContentLoadingStates,
	useExternalCompartment,
} from '../../hooks';
import { contentFacade } from '../../store/content';
import {
	CompartmentType,
	ContentCompartmentModel,
	contentCompartmentsFacade,
} from '../../store/ui/contentCompartments';

import {
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
	isCreating = false,
	onSubmit = () => null,
	onCancel = () => null,
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
	const internalCompartments = useMemo(() => INTERNAL_COMPARTMENTS(siteId), [siteId]);
	const workingTitleMapper = useMemo(() => getWorkTitleMapper(contentType), [contentType]);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmModalState, setConfirmModalState] = useState(ContentStatus.PUBLISHED);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigateToPlanning = (): void => {
		navigate(`${MODULE_PATHS.detailEdit}/planning`, {
			siteId,
			contentId,
		});
	};

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
		alertService.dismiss();

		if (!contentItem.meta.publishTime && !contentItem.meta.unpublishTime) {
			return;
		}

		const formattedDate = moment(
			contentItem?.meta.publishTime || contentItem?.meta.unpublishTime
		).format(DATE_FORMATS.date);

		const formattedTime = moment(
			contentItem?.meta.publishTime || contentItem?.meta.unpublishTime
		).format(DATE_FORMATS.time);

		if (
			(contentItem?.meta.publishTime &&
				contentItem?.meta.publishTime < new Date().toISOString()) ||
			(contentItem?.meta.unpublishTime &&
				contentItem?.meta.unpublishTime < new Date().toISOString())
		) {
			const isInvalidPublishTime =
				contentItem?.meta.publishTime &&
				contentItem?.meta.publishTime < new Date().toISOString();

			alertService.danger(
				{
					title: `Opgelet, de ${
						isInvalidPublishTime ? 'publicatiedatum' : 'archiveringsdatum'
					} ligt in het verleden`,
					message: (
						<>
							De {isInvalidPublishTime ? 'publicatiedatum' : 'archiveringsdatum'} van
							dit content item staat ingesteld op <strong>{formattedDate}</strong> om{' '}
							<strong>{formattedTime}</strong>. Dat is een datum die in het verleden
							ligt. Je kan het item nu meteen{' '}
							{isInvalidPublishTime ? 'publiceren' : 'archiveren'} of de{' '}
							{isInvalidPublishTime ? 'publicatiedatum' : 'archiveringsdatum'}
							aanpassen naar een datum in de toekomst.
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
										setConfirmModalState(
											isInvalidPublishTime
												? ContentStatus.PUBLISHED
												: ContentStatus.UNPUBLISHED
										);
										setShowConfirmModal(true);
									}}
								>
									{isInvalidPublishTime ? 'Publiceer nu' : 'Archiveer nu'}
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

		const isValidPublishTime = !!contentItem?.meta.publishTime;

		alertService.warning(
			{
				title: `${isValidPublishTime ? 'Publicatiedatum' : 'Archiveringsdatum'} ingesteld`,
				message: (
					<>
						Dit content item wordt binnenkort automatisch{' '}
						{isValidPublishTime ? 'gepubliceerd' : 'gearchiveerd'}. De{' '}
						{isValidPublishTime ? 'publicatiedatum' : 'archiveringsdatum'} staat
						ingesteld op <strong>{formattedDate}</strong> om{' '}
						<strong>{formattedTime}</strong>. Bekijk de planning indien deze datum niet
						correct is.
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

				if (isCreating && !slugFieldTouched) {
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

	const onPublishPromptCancel = (): void => {
		setShowConfirmModal(false);
	};

	const onPublishPromptConfirm = async (): Promise<void> => {
		setIsSubmitting(true);

		let data = contentItemDraft;

		if (confirmModalState === ContentStatus.PUBLISHED) {
			data = {
				...data,
				meta: {
					...data.meta,
					publishTime: undefined,
					status:
						contentItemDraft.meta.unpublishTime &&
						contentItemDraft.meta.unpublishTime < new Date().toISOString()
							? ContentStatus.UNPUBLISHED
							: ContentStatus.PUBLISHED,
				},
			};
		}

		if (confirmModalState === ContentStatus.UNPUBLISHED) {
			data = {
				...data,
				meta: {
					...data.meta,
					publishTime: undefined,
					unpublishTime: undefined,
					status: ContentStatus.UNPUBLISHED,
				},
			};
		}

		await onFormSubmit(data);
		setIsSubmitting(false);
		setShowConfirmModal(false);
	};

	const getContentTitle = (title: string): string => {
		return title ? `'${title}'` : 'Content';
	};

	const onSave = (): void => {
		if (contentItemDraft?.meta.status !== ContentStatus.PUBLISHED) {
			onFormSubmit(contentItemDraft);
			return;
		}

		if (
			contentItemDraft?.meta.unpublishTime &&
			contentItemDraft?.meta.unpublishTime < new Date().toISOString()
		) {
			setConfirmModalState(ContentStatus.UNPUBLISHED);
		}

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
						isPublished={!!contentItem?.meta?.historySummary?.published}
						isSaved={!hasChanges}
						status={contentItem?.meta?.status}
						onStatusClick={onStatusClick}
						onSave={onSave}
						showPublishedStatus={showPublishedStatus}
						isSaving={
							updateContentItemLoadingState === LoadingState.Loading ||
							createContentItemLoadingState === LoadingState.Loading
						}
						isPublishing={publishContentItemLoadingState === LoadingState.Loading}
						onUpdatePublication={() => onUpdatePublication(contentItemDraft)}
						onCancel={handleCancel}
					/>
				</ActionBarContentSection>
			</ActionBar>
			<ControlledModal show={showConfirmModal} onClose={onPublishPromptCancel} size="large">
				<ControlledModalHeader>
					<h4>
						{getContentTitle(contentItemDraft?.meta.label)} nu{' '}
						{confirmModalState === ContentStatus.PUBLISHED
							? 'publiceren'
							: 'archiveren'}
					</h4>
				</ControlledModalHeader>
				<ControlledModalBody>
					<div>
						Je staat op het punt om dit content item te{' '}
						{confirmModalState === ContentStatus.PUBLISHED
							? 'publiceren'
							: 'archiveren'}
						. Weet je het zeker?
					</div>
				</ControlledModalBody>
				<ControlledModalFooter>
					<div className="u-flex u-flex-item u-flex-justify-end">
						<Button onClick={onPublishPromptCancel} negative>
							Annuleer
						</Button>
						<Button
							iconLeft={isSubmitting ? 'circle-o-notch fa-spin' : ''}
							disabled={isSubmitting}
							onClick={onPublishPromptConfirm}
							type="success"
						>
							Ok,{' '}
							{confirmModalState === ContentStatus.PUBLISHED
								? 'publiceer'
								: 'archiveer'}
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
