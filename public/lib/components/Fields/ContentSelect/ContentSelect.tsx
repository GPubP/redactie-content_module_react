import { Autocomplete } from '@acpaas-ui/react-components';
import { InputFieldProps } from '@redactie/form-renderer-module';
import { getIn } from 'formik';
import React, { useContext } from 'react';
import { first } from 'rxjs/operators';

import './ContentSelect.scss';

import { ErrorMessage } from '../../../connectors/formRenderer';
import { LoadingState } from '../../../content.types';
import TenantContext from '../../../context/TenantContext/TenantContext';
import { useCcContent } from '../../../hooks';
import { ccContentFacade } from '../../../store/ccContent';

const ContentSelect: React.FC<InputFieldProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}: InputFieldProps) => {
	const config = fieldSchema.config || {};
	const { field, form } = fieldProps;

	const touch = getIn(form.touched, field.name);
	const error = getIn(form.errors, field.name);

	const state = !!error && !!touch ? 'error' : '';
	const { siteId } = useContext(TenantContext);

	const [contentLoadingState] = useCcContent();

	return (
		<>
			<Autocomplete
				label={fieldSchema.label}
				id={fieldSchema.name}
				state={state}
				multipleSelect={false}
				defaultValue={field.value}
				showSearchIcon={true}
				loading={contentLoadingState === LoadingState.Loading}
				onSelection={(selected: string) => {
					fieldHelperProps.setValue(selected);
				}}
				asyncItems={async (query: string, cb: (options: any[]) => void) => {
					await ccContentFacade.getContent(siteId, {
						skip: 0,
						limit: 10,
						search: query,
						...(config.contentTypes?.length
							? { contentTypes: config.contentTypes.join(',') }
							: {}),
					});

					ccContentFacade.content$.pipe(first()).subscribe(content => {
						const newItems = content.map(c => ({
							label: c.meta.label,
							value: c.uuid,
						}));
						cb(newItems);
					});
				}}
			></Autocomplete>
			{config.description ? (
				<div className="a-input a-input__wrapper">
					<small>{config.description}</small>
				</div>
			) : null}
			<ErrorMessage name={field.name} />
		</>
	);
};

export default ContentSelect;
