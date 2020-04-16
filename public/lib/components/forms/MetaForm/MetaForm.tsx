import { TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import AutoSubmit from '../AutoSubmit/AutoSubmit';

const MetaForm: FC<CompartmentProps> = ({ value, onChange }): ReactElement | null => {
	/**
	 * METHODS
	 */

	/**
	 * RENDER
	 */
	return (
		<Formik
			onSubmit={() => {
				return;
			}}
			initialValues={value}
		>
			{() => (
				<>
					<AutoSubmit onChange={onChange} />
					<div className="u-margin-bottom">
						<Field
							type="text"
							label="Label"
							name="label"
							placeholder="Typ een label"
							required
							as={TextField}
						/>
						<div className="u-text-light u-margin-top-xs">Vul een label in</div>
					</div>
					<div>
						<Field
							type="text"
							label="Slug"
							name="slug"
							placeholder="Typ een slug"
							required
							as={TextField}
						/>
						<div className="u-text-light u-margin-top-xs">Vul een slug in</div>
					</div>
				</>
			)}
		</Formik>
	);
};

export default MetaForm;
