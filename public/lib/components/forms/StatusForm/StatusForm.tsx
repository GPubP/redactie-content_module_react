import { Button, CardBody, RadioGroup } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
} from '@acpaas-ui/react-editorial-components';
import { Field, Formik, FormikProps, FormikValues } from 'formik';
import React, { FC, useMemo, useState } from 'react';

import { CompartmentProps, ContentStatus } from '../../../api/api.types';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

import { STATUS_OPTIONS, STATUS_VALIDATION_SCHEMA } from './StatusForm.const';
import { StatusFormOption } from './StatusForm.types';

const StatusForm: FC<CompartmentProps> = ({
	value,
	onChange = () => undefined,
	formikRef,
	contentItem,
}) => {
	const [showPlanningWarningModal, setShowPlanningWarningModal] = useState<boolean>(false);

	const onFormChange = (values: FormikValues, submitForm: () => Promise<void>): void => {
		if (
			values.status === ContentStatus.PENDING_PUBLISH &&
			(values.publishTime < new Date().toISOString() ||
				values.unpublishTime < new Date().toISOString())
		) {
			setShowPlanningWarningModal(true);
			return;
		}

		submitForm();
		onChange(values);
	};

	const getStatusOptions = useMemo(
		(): StatusFormOption[] =>
			STATUS_OPTIONS.map(option => {
				if (option.value !== contentItem?.meta.status) {
					return option;
				}
				return { ...option, label: `${option.label} (huidige status)` };
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[contentItem?.meta.status]
	);

	const closeModal = (setFieldValue: FormikProps<FormikValues>['setFieldValue']): void => {
		setFieldValue('status', value.status);
		setShowPlanningWarningModal(false);
	};

	const publish = (setFieldValue: FormikProps<FormikValues>['setFieldValue']): void => {
		if (value.publishTime < new Date().toISOString()) {
			setFieldValue('publishTime', null);
		}

		if (value.unpublishTime < new Date().toISOString()) {
			setFieldValue('archiveTime', null);
		}

		setFieldValue('status', ContentStatus.PUBLISHED);
		setShowPlanningWarningModal(false);
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
			validationSchema={STATUS_VALIDATION_SCHEMA}
		>
			{({ submitForm, setFieldValue, values }) => (
				<CardBody>
					<FormikOnChangeHandler onChange={values => onFormChange(values, submitForm)} />
					<h2 className="h3 u-margin-bottom">Status</h2>
					<div className="row">
						<div className="col-xs-12 u-margin-bottom">
							{/* Key prop is needed to handle state correctly when status is changed */}
							<Field
								label="U kan de status van dit item wijzigen volgens de rechten die u hebt."
								name="status"
								id="status"
								options={getStatusOptions}
								key={values.status}
								required
								as={RadioGroup}
							/>
						</div>
					</div>
					<ControlledModal
						show={showPlanningWarningModal}
						onClose={() => closeModal(setFieldValue)}
						size="large"
					>
						<ControlledModalHeader>
							{/* TODO: Add modal header copy */}
							<h4>Planningsconflict</h4>
						</ControlledModalHeader>
						<ControlledModalBody>
							{/* TODO: Add modal body copy */}
							<div>Data ligt in het verleden.</div>
						</ControlledModalBody>
						<ControlledModalFooter>
							<div className="u-flex u-flex-item u-flex-justify-end">
								<Button onClick={() => closeModal(setFieldValue)} negative>
									Annuleer
								</Button>
								<Button onClick={() => publish(setFieldValue)} type="warning">
									Publiceren
								</Button>
							</div>
						</ControlledModalFooter>
					</ControlledModal>
				</CardBody>
			)}
		</Formik>
	);
};

export default StatusForm;
