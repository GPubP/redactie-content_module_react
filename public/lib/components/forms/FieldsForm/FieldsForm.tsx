import React, { FC, ReactElement, useMemo } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import { getForm } from '../../../connectors/formRenderer';
import { ContentFormContext } from '../../../context';
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
	const contentFormContext = useMemo(() => ({ contentType }), [contentType]);

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
			<ContentFormContext.Provider value={contentFormContext}>
				<Form
					{...formProps}
					formikRef={instance => {
						if (instance) {
							formikRef && formikRef(instance);
						}
					}}
					log={false}
					initialValues={value}
					onChange={onChange}
					useDividers={true}
				/>
			</ContentFormContext.Provider>
		</>
	);
};

export default FieldsForm;
