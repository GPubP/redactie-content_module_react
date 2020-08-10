import { RadioGroup } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import { ContentStatus } from '../../../services/content';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

const StatusForm: FC<CompartmentProps> = ({ value, onChange, formikRef }): ReactElement | null => {
	/**
	 * TODO:
	 * SCHEDULED mappen naar DRAFT
	 *
	 * Add UNPUBLISHED option (gearchiveerd)
	 */

	const statusOptions = [
		{
			key: '0',
			value: ContentStatus.DRAFT,
			label: 'Werkversie (huidige status)',
		},
		{
			key: '1',
			value: ContentStatus.PENDING,
			label: 'Klaar voor nakijken',
		},
		{
			key: '2',
			value: ContentStatus.PUBLISHED,
			label: 'Gepubliceerd',
		},
	];
	/**
	 * METHODS
	 */

	/**
	 * RENDER
	 */
	return (
		<Formik
			innerRef={instance => formikRef && formikRef(instance)}
			onSubmit={onChange}
			initialValues={value}
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
								options={statusOptions}
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
