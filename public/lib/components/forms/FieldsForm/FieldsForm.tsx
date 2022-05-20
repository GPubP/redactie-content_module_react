import React, { FC, ReactElement, useMemo } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import formRendererConnector from '../../../connectors/formRenderer';
import { ContentFormContext } from '../../../context';
import { getCompartmentFormProps } from '../../../helpers/getCompartmentFormProps';
import { CtTypeSettings } from '../../../views/ContentForm/ContentForm.types';

const FieldsForm: FC<CompartmentProps & { settings: CtTypeSettings }> = ({
	contentType,
	value,
	onChange,
	formikRef,
	activeLanguage,
	settings,
}): ReactElement | null => {
	const Form = formRendererConnector.api.Form;
	const contentFormContext = useMemo(() => ({ contentType }), [contentType]);

	/**
	 * Render
	 */
	if (!contentType || !Form) {
		return null;
	}

	const formProps = getCompartmentFormProps(contentType, settings, activeLanguage);

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
					activeLanguage={activeLanguage}
					useDividers={true}
				/>
			</ContentFormContext.Provider>
		</>
	);
};

export default FieldsForm;
