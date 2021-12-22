import { useField } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';

import formRendererConnector from '../../../../connectors/formRenderer';

import { DateTimeFieldProps } from './DateTimeField.types';

const DateTimeField: FC<DateTimeFieldProps> = ({ form, fieldSchema }): ReactElement | null => {
	const fieldRegistry = formRendererConnector.api.fieldRegistry;

	const FieldItem = useMemo(() => fieldRegistry?.get('core', 'dateTime'), [fieldRegistry]);
	const [field, meta, helpers] = useField(fieldSchema.name);

	if (!FieldItem) {
		return <></>;
	}

	return (
		<FieldItem.component
			fieldProps={{
				field,
				meta,
				form,
			}}
			fieldHelperProps={helpers}
			fieldSchema={fieldSchema}
		/>
	);
};

export default DateTimeField;
