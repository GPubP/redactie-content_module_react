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
import {
	StateMachineContext,
	StateMachineEvent,
	StateMachineHelper,
} from '@redactie/redactie-workflows';
import { alertService, LeavePrompt, LoadingState, NavListItem, useNavigate } from '@redactie/utils';
import { WorkflowPopulatedTransition } from '@redactie/workflows-module';
import { FormikProps, FormikValues, setNestedObjectValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty, lensPath, path, set } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { createMachine, StateMachine } from 'xstate';

import { ContentSchema, ContentStatus } from '../../api/api.types';
import { ContentFormActions } from '../../components';
import rolesRightsConnector from '../../connectors/rolesRights';
import sitesConnector from '../../connectors/sites';
import workflowsConnector from '../../connectors/workflows';
import {
	CONTENT_MODAL_MAP,
	MODULE_PATHS,
	SITES_ROOT,
	WORKING_TITLE_KEY,
} from '../../content.const';
import { ALERT_CONTAINER_IDS } from '../../content.types';
import {
	filterExternalCompartments,
	getCompartmentValue,
	getContentTypeCompartments,
	getSettings,
	getWorkTitleMapper,
	runAllSubmitHooks,
	validateCompartments,
} from '../../helpers/contentCompartments';
import { setValidity } from '../../helpers/setValidity';
import {
	useContentAction,
	useContentCompartment,
	useContentLoadingStates,
	useExternalAction,
	useExternalCompartment,
} from '../../hooks';
import { ContentSystemNames } from '../../services/content';
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
	const workflowId = useMemo(() => {
		if (!contentType || !siteId) {
			return;
		}

		return contentType.modulesConfig?.find(
			config => config.name === 'workflow' && config.site === siteId
		)?.config.workflow;
	}, [contentType, siteId]);
	const [workflow] = workflowsConnector.hooks.useWorkflow(workflowId, siteId);
	const [, roles] = rolesRightsConnector.api.hooks.useUserRolesForSite();
	const [initialStatus, setInitialStatus] = useState<string | undefined>();

	const machine = useMemo<
		StateMachine<StateMachineContext, any, StateMachineEvent> | undefined
	>(() => {
		if (!workflow || !roles || (!contentItem && !contentItemDraft) || !initialStatus) {
			return undefined;
		}

		const config = StateMachineHelper.getConfig(
			{
				...workflow,
				data: {
					...workflow.data,
					transitions: workflow.data.transitions as WorkflowPopulatedTransition[],
				},
			},
			initialStatus,
			roles.reduce(
				(acc: string[], role) => [...acc, role.id, role.attributes.displayName],
				[]
			)
		);

		return createMachine(config.value, config.options);
	}, [contentItem, contentItemDraft, initialStatus, roles, workflow]);

	const allowedTransitions = useMemo(() => {
		if (!machine) {
			return [];
		}

		return machine.initialState.nextEvents.filter(nextEvent => {
			return (
				machine.transition(machine.initialState, nextEvent).changed ||
				(`to-${machine.initialState.value}` === nextEvent &&
					machine.options.guards.userHasRole(
						machine.context,
						nextEvent as any,
						{
							cond: path(
								[
									'machine',
									'config',
									'states',
									machine.initialState.value.toString(),
									'on',
									nextEvent,
									'cond',
								],
								machine
							),
						} as any
					))
			);
		});
	}, [machine]);
	const canTransition = useMemo(
		() =>
			allowedTransitions.includes(
				`to-${contentItemDraft.meta.workflowState ||
					(ContentSystemNames as Record<string, string>)[contentItemDraft.meta.status]}`
			),
		[allowedTransitions, contentItemDraft.meta.status, contentItemDraft.meta.workflowState]
	);

	const internalCompartments = useMemo(() => {
		return INTERNAL_COMPARTMENTS(
			siteId,
			contentType,
			workflow,
			(allowedTransitions || []).map(transition => transition.replace('to-', ''))
		);
	}, [allowedTransitions, contentType, siteId, workflow]);

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
			setModalState(CONTENT_MODAL_MAP(title, publishTime).publish);
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
		rolesRightsConnector.api.store.users.service.getUserRolesForSite({
			siteUuid: siteId,
			userUuid: 'me',
		});
	}, [siteId]);

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
				...setValidity(
					compartments,
					getContentTypeCompartments(contentType) as ContentCompartmentModel[]
				),
				...setValidity(compartments, internalCompartments),
				...setValidity(
					compartments,
					filterExternalCompartments(
						contentItemDraft,
						contentType,
						externalCompartments,
						isCreating
					)
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

	useEffect(() => {
		if (!contentItemDraft || (initialStatus && hasChanges)) {
			return;
		}

		setInitialStatus(
			contentItem?.meta.workflowState ||
				contentItemDraft?.meta.workflowState ||
				(ContentSystemNames as Record<string, string>)[contentItem?.meta.status]
		);
	}, [contentItem, contentItemDraft, initialStatus]); // eslint-disable-line react-hooks/exhaustive-deps

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
					const slug = kebabCase(path(workingTitlePath, fieldValues));

					contentFacade.updateContentMetaDraft(
						{
							slug: { nl: slug },
						},
						contentType
					);
				}

				contentFacade.updateContentFieldsDraft(fieldValues);

				break;
			}
			case CompartmentType.INTERNAL: {
				const metaValues = values as ContentSchema['meta'];

				if (isCreating && !isEmpty(metaValues.slug?.nl)) {
					setSlugFieldTouched(true);
				}

				contentFacade.updateContentMetaDraft(metaValues, contentType);

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

	const beforeSubmit = (contentDraft: ContentSchema): Promise<ContentSchema> => {
		return runAllSubmitHooks(
			compartments,
			contentType,
			contentDraft,
			contentItem,
			'beforeSubmit'
		).then(({ hasRejected, errorMessages, contentItem }) => {
			if (!hasRejected) {
				return contentItem;
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

			throw new Error('beforeSubmit error');
		});
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

		await beforeSubmit(modifiedContentItemDraft)
			.then((contentItem: ContentSchema) => {
				onSubmit(contentItem, activeCompartment, compartments);
			})
			.catch(() => {
				/**/
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
			return beforeSubmit(contentItemDraft)
				.then((contentItem: ContentSchema) => {
					onUpdatePublication(contentItem, compartments);
					setIsSubmitting(false);
					setShowConfirmModal(false);
				})
				.catch(() => {
					/**/
				});
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
							machine={machine}
							allowedTransitions={allowedTransitions}
							isCreating={isCreating}
							isValid
							settings={getSettings(contentType, activeCompartment)}
							onChange={values => handleChange(activeCompartment, values)}
							workflow={workflow}
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
						disableSave={
							(!hasChanges &&
								contentItem?.meta.workflowState === ContentSystemNames.PUBLISHED &&
								contentItemDraft?.meta.workflowState ===
									ContentSystemNames.PUBLISHED) ||
							(contentItemDraft?.meta.workflowState ===
								ContentSystemNames.PUBLISHED &&
								!!contentItem?.meta?.historySummary?.published) ||
							!canTransition
						}
						disableUpdatePublication={
							(!hasChanges &&
								allowedTransitions.includes(
									`to-${ContentSystemNames.PUBLISHED}`
								)) ||
							!allowedTransitions.includes(`to-${ContentSystemNames.PUBLISHED}`) ||
							contentItemDraft?.meta.workflowState !== ContentSystemNames.PUBLISHED
						}
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
