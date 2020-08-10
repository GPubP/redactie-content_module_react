import { RadioGroup } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

import { STATUS_OPTIONS, STATUS_VALIDATION_SCHEMA } from './StatusForm.const';

const StatusForm: FC<CompartmentProps> = ({ value, onChange, formikRef }) => {
	/**
	 * RENDER
	 */
	return (
		<Formik
			innerRef={instance => formikRef && formikRef(instance)}
			initialValues={value}
			onSubmit={onChange}
			validationSchema={STATUS_VALIDATION_SCHEMA}
		>
			{({ submitForm }) => (
				<>
					<FormikOnChangeHandler onChange={submitForm} />
					<h5 className="u-margin-bottom">Status</h5>
					<div className="row">
						<div className="col-xs-12 col-md-6 u-margin-bottom">
							<Field
								label="U kan de status van dit item wijzigen volgens de rechten die u hebt."
								name="status"
								id="status"
								options={STATUS_OPTIONS}
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
