import { RadioGroup } from '@acpaas-ui/react-components';
import { Field, Formik, FormikValues } from 'formik';
import React, { FC } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

import { STATUS_OPTIONS, STATUS_VALIDATION_SCHEMA } from './StatusForm.const';
import { StatusFormOption } from './StatusForm.types';

const StatusForm: FC<CompartmentProps> = ({
	value,
	onChange = () => undefined,
	formikRef,
	contentItem,
}) => {
	const onFormChange = (values: FormikValues, submitForm: () => Promise<void>): void => {
		submitForm();
		onChange(values);
	};

	const getStatusOptions = (): StatusFormOption[] =>
		STATUS_OPTIONS.map(option => {
			if (option.value !== contentItem?.meta.status) {
				return option;
			}
			return { ...option, label: `${option.label} (huidige status)` };
		});

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
			{({ submitForm }) => (
				<>
					<FormikOnChangeHandler onChange={values => onFormChange(values, submitForm)} />
					<h5 className="u-margin-bottom">Status</h5>
					<div className="row">
						<div className="col-xs-12 col-md-6 u-margin-bottom">
							<Field
								label="U kan de status van dit item wijzigen volgens de rechten die u hebt."
								name="status"
								id="status"
								options={getStatusOptions()}
								required
								as={RadioGroup}
							/>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

export default StatusForm;
