import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { alertService, LeavePrompt, LoadingState } from '@redactie/utils';
import { FormikProps, FormikValues, setNestedObjectValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty, lensPath, set } from 'ramda';
import React, { FC, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ContentSchema } from '../../api/api.types';
import { ContentFormActions } from '../../components';
import { ALERT_CONTAINER_IDS, WORKING_TITLE_KEY } from '../../content.const';
import { NavListItem } from '../../content.types';
import {
	filterCompartments,
	getCompartmentValue,
	getSettings,
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
	isCreating,
	match,
	showPublishedStatus,
	onSubmit = () => null,
	onCancel = () => null,
	onStatusClick = () => null,
	onUpdatePublication = () => null,
}) => {
	const { compartment } = match.params;

	/**
	 * Hooks
	 */
	const [
		{ compartments, active: activeCompartment },
		register,
		activate,
		validate,
	] = useContentCompartment();
	const [externalCompartments] = useExternalCompartment();
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const [navList, setNavlist] = useState<NavListItem[]>([]);
	const [hasSubmit, setHasSubmit] = useState(false);
	const [slugFieldTouched, setSlugFieldTouched] = useState(false);
	const [
		,
		createContentItemLoadingState,
		updateContentItemLoadingState,
		publishContentItemLoadingState,
	] = useContentLoadingStates();

	useEffect(() => {
		if (!contentType) {
			return;
		}

		register(
			[
				...INTERNAL_COMPARTMENTS(contentType),
				...filterCompartments(contentItemDraft, contentType, externalCompartments),
			],
			{ replace: true }
		);
	}, [contentType, externalCompartments]); // eslint-disable-line

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

	/**
	 * Methods
	 */
	const handleChange = (compartment: ContentCompartmentModel, values: unknown): void => {
		if (!contentItemDraft) {
			return;
		}

		switch (compartment.type) {
			case CompartmentType.CT: {
				const fieldValues = values as ContentSchema['fields'];
				if (isCreating && !slugFieldTouched) {
					contentFacade.updateContentMetaDraft({
						slug: { nl: kebabCase(fieldValues[WORKING_TITLE_KEY]) },
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

	const onFormSubmit = (contentItemDraft: ContentSchema): void => {
		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(compartments, contentItemDraft, validate);

		// Validate current form to trigger fields error states
		if (formikRef) {
			formikRef.validateForm().then(errors => {
				if (!isEmpty(errors)) {
					formikRef.setErrors(errors);
				}
			});
		}

		if (compartmentsAreValid && activeCompartment) {
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

			if (isCreating) {
				contentFacade.setIsCreating(true);
			} else {
				contentFacade.setIsUpdating(true);
			}
			runAllSubmitHooks(
				activeCompartment,
				compartments,
				contentType,
				modifiedContentItemDraft,
				!!isCreating,
				'beforeSubmit'
			).then(({ hasRejected, errorMessages, contentItem }) => {
				if (!hasRejected) {
					contentFacade.setContentItemDraft(contentItem);
					onSubmit(contentItem, activeCompartment, compartments);
					return;
				}
				if (isCreating) {
					contentFacade.setIsCreating(false);
				} else {
					contentFacade.setIsUpdating(false);
				}
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
		}

		setHasSubmit(true);
	};

	if (!activeCompartment) {
		return null;
	}

	/**
	 * RENDER
	 */
	return (
		<>
			<div className="row between-xs top-xs u-margin-bottom-lg">
				<div className="col-xs-3">
					<NavList linkComponent={NavLink} items={navList} />
				</div>

				<div className="m-card col-xs-9 u-padding">
					<div className="u-margin">
						<activeCompartment.component
							formikRef={instance => {
								if (!equals(instance, activeCompartmentFormikRef.current)) {
									activeCompartmentFormikRef.current = instance;
								}
							}}
							// TODO: only clone for external modules
							// Temp. remove clones to restore performance
							contentType={contentType}
							contentValue={contentItemDraft}
							contentItem={contentItem}
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
					</div>
				</div>
			</div>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<ContentFormActions
						isPublished={!!contentItem?.meta?.historySummary?.published}
						isSaved={!hasChanges}
						status={contentItem?.meta?.status}
						onStatusClick={onStatusClick}
						onSave={() => onFormSubmit(contentItemDraft)}
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
			<LeavePrompt
				allowedPaths={
					isCreating ? CONTENT_CREATE_ALLOWED_PATHS : CONTENT_EDIT_ALLOWED_PATHS
				}
				when={hasChanges}
				onConfirm={() => onFormSubmit(contentItemDraft)}
			/>
		</>
	);
};

export default ContentForm;
