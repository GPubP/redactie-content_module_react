import React, { FC, ReactElement } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import { getForm } from '../../../connectors/formRenderer';
import { getCompartmentFormProps } from '../../../helpers/getCompartmentFormProps';
import { CtTypeSettings } from '../../../views/ContentForm/ContentForm.types';

const FieldsForm: FC<CompartmentProps & { settings: CtTypeSettings }> = ({
	contentType,
	value,
	onChange,
	formikRef,
	settings,
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

	const formProps = getCompartmentFormProps(contentType, settings);

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
