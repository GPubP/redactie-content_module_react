import { CardBody } from '@acpaas-ui/react-components';
import { StateMachineContext, StateMachineEvent } from '@redactie/redactie-workflows';
import { FormikOnChangeHandler } from '@redactie/utils';
import { Field, FieldProps, Formik, FormikValues } from 'formik';
import React, { FC, ReactElement } from 'react';
import { StateMachine } from 'xstate';

import { CompartmentProps } from '../../../api/api.types';
import formRendererConnector from '../../../connectors/formRenderer';
import { ContentSystemNames } from '../../../services/content';
import { DateTimeField } from '../../Fields';

import { PLANNING_VALIDATION_SCHEMA } from './PlanningForm.const';

const PlanningForm: FC<CompartmentProps> = ({
	value,
	onChange = () => undefined,
	machine,
	formikRef,
}): ReactElement | null => {
	const onFormChange = (values: FormikValues, submitForm: () => Promise<void>): void => {
		submitForm();
		onChange(values);
	};

	/**
	 * RENDER
	 */
	return (
		<formRendererConnector.api.FormContext.Provider
			value={{
				useDividers: false,
				allowedHeaders: [...formRendererConnector.api.DEFAULT_ALLOWED_HEADERS],
			}}
		>
			<formRendererConnector.api.FieldRendererContext.Provider
				value={{
					level: 0,
					renderContext: {
						wrapperClass: 'col-xs-12',
					},
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					setWrapperClass: () => {},
				}}
			>
				<Formik
					innerRef={instance => formikRef && formikRef(instance)}
					enableReinitialize
					initialValues={value}
					onSubmit={onChange}
					validationSchema={PLANNING_VALIDATION_SCHEMA}
				>
					{({ submitForm }) => (
						<CardBody>
							<FormikOnChangeHandler
								onChange={values => onFormChange(values, submitForm)}
							/>
							<h2 className="h3 u-margin-bottom">Planning</h2>
							<p className="u-margin-bottom">
								Vul deze data alleen in als je (wijzingingen aan) deze pagina in de
								toekomst wil publiceren of archiveren.
							</p>
							<div className="row">
								<div className="col-xs-12 u-margin-bottom u-margin-top">
									<Field>
										{({ form }: FieldProps) => (
											<DateTimeField
												form={form}
												fieldSchema={{
													name: 'publishTime',
													module: 'core',
													type: 'string',
													config: {
														minDate: new Date(),
														inputDescription:
															'Vul een publicatiedatum in als je wilt dat de pagina later automatisch online verschijnt. Wil je de pagina meteen publiceren? Laat dan deze velden leeg.',
														disabled: !Object.keys(
															(machine as StateMachine<
																StateMachineContext,
																any,
																StateMachineEvent
															>)?.states || {}
														).includes(
															ContentSystemNames.PENDING_PUBLISH
														),
													},
													dataType: '',
													semanticType: '',
													label: 'Publicatie op',
												}}
											/>
										)}
									</Field>
								</div>
								<div className="col-xs-12 u-margin-bottom u-margin-top">
									<Field>
										{({ form }: FieldProps) => (
											<DateTimeField
												form={form}
												fieldSchema={{
													name: 'unpublishTime',
													module: 'core',
													type: 'string',
													config: {
														minDate: new Date(),
														inputDescription:
															'Geef een datum in waarop de pagina offline gezet wordt. Wil je de pagina niet automatisch archiveren? Laat dan deze velden leeg.',
														disabled: !Object.keys(
															(machine as StateMachine<
																StateMachineContext,
																any,
																StateMachineEvent
															>)?.states || {}
														).includes(ContentSystemNames.UNPUBLISHED),
													},
													dataType: '',
													semanticType: '',
													label: 'Archivering op',
												}}
											/>
										)}
									</Field>
								</div>
							</div>
						</CardBody>
					)}
				</Formik>
			</formRendererConnector.api.FieldRendererContext.Provider>
		</formRendererConnector.api.FormContext.Provider>
	);
};

export default PlanningForm;
