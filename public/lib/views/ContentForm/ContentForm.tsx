import { Button } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { FormikProps, FormikValues } from 'formik';
import { clone, equals } from 'ramda';
import React, { FC, useEffect, useRef, useState } from 'react';

import { ContentSchema } from '../../api/api.types';
import NavList from '../../components/NavList/NavList';
import { NavListItem } from '../../components/NavList/NavList.types';
import { useCoreTranslation } from '../../connectors/translations';
import {
	filterCompartments,
	getCompartmentValue,
	getSettings,
	validateCompartments,
} from '../../helpers/contentCompartments';
import { useContentCompartment, useExternalCompartment } from '../../hooks';
import { contentFacade } from '../../store/content';
import { CompartmentType, ContentCompartmentModel } from '../../store/ui/contentCompartments';

import { INTERNAL_COMPARTMENTS } from './ContentForm.const';
import { ContentFormMatchProps, ContentFormRouteProps } from './ContentForm.types';

const ContentForm: FC<ContentFormRouteProps<ContentFormMatchProps>> = ({
	history,
	contentType,
	contentItemDraft,
	match,
	onSubmit,
	onCancle,
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
	const [t] = useCoreTranslation();

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

	const onFormSubmit = (content: ContentSchema): void => {
		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(compartments, content, validate);

		// Validate current form to trigger fields error states
		if (formikRef) {
			formikRef.validateForm();
		}
		// Only submit the form if all compartments are valid
		if (compartmentsAreValid) {
			onSubmit(content);
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
					<NavList items={navList} />
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
								isValid={true}
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
					<div className="u-wrapper row end-xs">
						<Button
							className="u-margin-right-xs"
							onClick={() =>
								contentItemDraft ? onFormSubmit(contentItemDraft) : null
							}
							type="success"
							htmlType="submit"
						>
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
						<Button onClick={onCancle} outline>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);
};

export default ContentForm;
