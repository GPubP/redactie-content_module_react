import React, { FC, ReactElement } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import { getForm } from '../../../connectors/formRenderer';
import { getFormPropsByCT } from '../../../services/helpers';

const FieldsForm: FC<CompartmentProps> = ({
	contentType,
	value,
	onChange,
}): ReactElement | null => {
	if (!contentType) {
		return null;
	}

	const Form = getForm();

	if (!Form) {
		return null;
	}

	const formProps = getFormPropsByCT(contentType);

	return <Form {...formProps} initialValues={value} onChange={onChange}></Form>;
};

export default FieldsForm;
