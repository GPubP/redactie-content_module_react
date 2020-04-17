import { FormikValues, useFormikContext } from 'formik';
import { equals } from 'ramda';
import { FC, useEffect, useRef } from 'react';

import { FormikOnChangeHandlerProps } from './FormikOnChangeHandler.types';

const FormikOnChangeHandler: FC<FormikOnChangeHandlerProps> = ({
	onChange,
	...formikProps
}): null => {
	const { initialValues, values } = useFormikContext() || formikProps;

	const oldValues = useRef(initialValues);

	useEffect(() => {
		if (!onChange) {
			return;
		}

		if (!equals(oldValues.current, values)) {
			oldValues.current = values;
			onChange(values as FormikValues);
		}
	}, [onChange, values]);

	return null;
};

export default FormikOnChangeHandler;
