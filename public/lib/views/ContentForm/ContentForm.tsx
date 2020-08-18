import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { FormikProps, FormikValues } from 'formik';
import { clone, equals } from 'ramda';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ContentSchema } from '../../api/api.types';
import { ContentFormActions } from '../../components';
import { LoadingState, NavListItem } from '../../content.types';
import {
	filterCompartments,
	getCompartmentValue,
	getSettings,
	validateCompartments,
} from '../../helpers/contentCompartments';
import {
	useContentCompartment,
	useContentLoadingStates,
	useExternalCompartment,
} from '../../hooks';
import { contentFacade } from '../../store/content';
import { CompartmentType, ContentCompartmentModel } from '../../store/ui/contentCompartments';

import { INTERNAL_COMPARTMENTS } from './ContentForm.const';
import { ContentFormMatchProps, ContentFormRouteProps } from './ContentForm.types';

const ContentForm: FC<ContentFormRouteProps<ContentFormMatchProps>> = ({
	history,
	contentType,
	contentItem,
	contentItemDraft,
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
	const [
		,
		createContentItemLoadingState,
		updateContentItemLoadingState,
		publishContentItemLoadingState,
	] = useContentLoadingStates();
	const ContentItemUnTouched = useMemo(() => equals(contentItem, contentItemDraft), [
		contentItem,
		contentItemDraft,
	]);

	useEffect(() => {
		// TODO: add compartments support later on
		if (!contentType) {
			return;
		}

		register(
			[
				...INTERNAL_COMPARTMENTS,
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
				label: compartment.label,
				to: compartment.slug || compartment.name,
				hasError: hasSubmit && compartment.isValid === false,
			}))
		);
	}, [compartments, hasSubmit]);

	// Trigger errors on form when switching from compartments
	useEffect(() => {
		if (hasSubmit && !activeCompartment?.isValid && activeCompartmentFormikRef.current) {
			activeCompartmentFormikRef.current.validateForm();
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
			case CompartmentType.CT:
				contentFacade.updateContentItemDraft({
					...contentItemDraft,
					fields: values as ContentSchema['fields'],
				});
				break;
			case CompartmentType.INTERNAL:
				contentFacade.updateContentItemDraft({
					...contentItemDraft,
					meta: { ...contentItemDraft.meta, ...(values as ContentSchema['meta']) },
				});
				break;
			case CompartmentType.MODULE:
				contentFacade.updateContentItemDraft({
					...contentItemDraft,
					modulesData: {
						...contentItemDraft.modulesData,
						[compartment.name]: values as any,
					},
				});
				break;
		}

		return;
	};

	const onFormSubmit = (contentItemDraft: ContentSchema): void => {
		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(compartments, contentItemDraft, validate);

		// Validate current form to trigger fields error states
		if (formikRef) {
			formikRef.validateForm();
		}
		// Only submit the form if all compartments are valid
		if (compartmentsAreValid) {
			onSubmit(contentItemDraft);
		}

		setHasSubmit(true);
	};

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
						{activeCompartment ? (
							<activeCompartment.component
								formikRef={instance => {
									if (!equals(instance, activeCompartmentFormikRef.current)) {
										activeCompartmentFormikRef.current = instance;
									}
								}}
								contentType={clone(contentType)}
								contentValue={clone(contentItemDraft)}
								isValid
								settings={getSettings(contentType, activeCompartment)}
								onChange={values => handleChange(activeCompartment, values)}
								value={getCompartmentValue(contentItemDraft, activeCompartment)}
								updateContent={(content: ContentSchema) =>
									contentFacade.updateContentItemDraft(content)
								}
							/>
						) : null}
					</div>
				</div>
			</div>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<ContentFormActions
						isPublished={!!contentItem?.meta?.historySummary?.published}
						isSaved={ContentItemUnTouched}
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
						onCancel={onCancel}
					/>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);
};

export default ContentForm;
