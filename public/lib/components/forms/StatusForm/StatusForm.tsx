import { CardBody, RadioGroup } from '@acpaas-ui/react-components';
import { WorkflowPopulatedTransition } from '@redactie/workflows-module';
import { Field, Formik, FormikValues } from 'formik';
import { contains } from 'ramda';
import React, { ChangeEvent, FC, useMemo } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import {
	CONTENT_SYSTEM_NAMES_API_MAP,
	ContentStatus,
	ContentSystemNames,
} from '../../../services/content';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

import { STATUS_VALIDATION_SCHEMA } from './StatusForm.const';
import { StatusFormOption } from './StatusForm.types';

const StatusForm: FC<CompartmentProps> = ({
	value,
	onChange = () => undefined,
	formikRef,
	contentItem,
	contentValue,
	workflow,
	machine,
	allowedTransitions,
}) => {
	const statusValidationSchema = useMemo(() => {
		return STATUS_VALIDATION_SCHEMA(
			(allowedTransitions || []).map(transition => transition.replace('to-', ''))
		);
	}, [allowedTransitions]);

	const statusOptions = useMemo(() => {
		if (!workflow || !machine || (!contentItem && !contentValue)) {
			return [];
		}

		const options = (workflow?.data.transitions as WorkflowPopulatedTransition[]).reduce(
			(acc: StatusFormOption[], transition: WorkflowPopulatedTransition) => {
				const optionFrom = {
					value: transition.from.data.systemName,
					label: `${transition.from.data.name} ${
						contentItem?.meta.workflowState === transition.from.data.systemName
							? '(huidige status)'
							: ''
					}`,
					disabled: !allowedTransitions?.includes(
						`to-${transition.from.data.systemName}`
					),
				};

				const optionTo = {
					value: transition.to.data.systemName,
					label: `${transition.to.data.name} ${
						contentItem?.meta.workflowState === transition.to.data.systemName
							? '(huidige status)'
							: ''
					}`,
					disabled: !allowedTransitions?.includes(`to-${transition.to.data.systemName}`),
				};

				return [
					...acc,
					...(optionFrom.value !== ContentSystemNames.NEW && !contains(optionFrom, acc)
						? [optionFrom]
						: []),
					...(optionTo.value !== ContentSystemNames.NEW && !contains(optionTo, acc)
						? [optionTo]
						: []),
				];
			},
			[]
		);

		return options.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
	}, [workflow, machine, contentItem, contentValue, allowedTransitions]);

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
			validationSchema={statusValidationSchema}
		>
			{({ submitForm, values, setFieldValue }) => (
				<CardBody>
					<FormikOnChangeHandler onChange={values => onFormChange(values, submitForm)} />
					<h2 className="h3 u-margin-bottom">Status</h2>
					<div className="row">
						<div className="col-xs-12 u-margin-bottom">
							{/* Key prop is needed to handle state correctly when status is changed */}
							<Field
								label="U kan de status van dit item wijzigen volgens de rechten die u hebt."
								name="workflowState"
								id="workflowState"
								options={statusOptions}
								key={values.workflowState}
								required
								as={RadioGroup}
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									setFieldValue('workflowState', e.target.value);
									setFieldValue(
										'status',
										CONTENT_SYSTEM_NAMES_API_MAP[
											e.target.value as ContentSystemNames
										]
											? CONTENT_SYSTEM_NAMES_API_MAP[
													e.target.value as ContentSystemNames
											  ]
											: ContentStatus.DRAFT
									);
								}}
							/>
						</div>
					</div>
				</CardBody>
			)}
		</Formik>
	);
};

export default StatusForm;
