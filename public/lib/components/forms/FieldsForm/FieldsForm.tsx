import React, { FC, ReactElement } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import { getForm } from '../../../connectors/formRenderer';
import { getFormPropsByCT } from '../../../helpers';

const FieldsForm: FC<CompartmentProps> = ({
	contentType,
	value,
	onChange,
	formikRef,
}): ReactElement | null => {
	const Form = getForm();

	/**
	 * Render
	 */
	if (!contentType) {
		return null;
	}

	if (!Form) {
		return null;
	}

	const formProps = getFormPropsByCT(contentType);

	return (
		<>
			<h5 className="u-margin-bottom">Inhoud</h5>
			<Form
				{...formProps}
				formikRef={instance => {
					if (instance) {
						formikRef && formikRef(instance);
					}
				}}
				initialValues={value}
				onChange={onChange}
			/>
		</>
	);
};

export default FieldsForm;
