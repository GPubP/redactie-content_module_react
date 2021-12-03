import { CardBody } from '@acpaas-ui/react-components';
import { StateMachineContext, StateMachineEvent } from '@redactie/redactie-workflows';
import { FormikOnChangeHandler } from '@redactie/utils';
import { Field, FieldProps, Formik, FormikValues } from 'formik';
import React, { FC, ReactElement } from 'react';
import { StateMachine } from 'xstate';

import { CompartmentProps } from '../../../api/api.types';
import { ContentSystemNames } from '../../../services/content';

import DateTimeField from './DateTimeField/DateTimeField';
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
		<Formik
			innerRef={instance => formikRef && formikRef(instance)}
			enableReinitialize
			initialValues={value}
			onSubmit={onChange}
			validationSchema={PLANNING_VALIDATION_SCHEMA}
		>
			{({ submitForm }) => (
				<CardBody>
					<FormikOnChangeHandler onChange={values => onFormChange(values, submitForm)} />
					<h2 className="h3 u-margin-bottom">Planning</h2>
					<p className="u-margin-bottom">
						Bepaal de publicatiedatum en de archiveringsdatum voor dit content item.
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
													'Geef een datum in. Deze datum moet in de toekomst liggen.',
												disabled: !Object.keys(
													(machine as StateMachine<
														StateMachineContext,
														any,
														StateMachineEvent
													>)?.states || {}
												).includes(ContentSystemNames.PENDING_PUBLISH),
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
													'Geef een datum in. Deze datum moet na de publicatiedatum liggen.',
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
	);
};

export default PlanningForm;
