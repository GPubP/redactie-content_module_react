import { CardBody, Textarea, TextField } from '@acpaas-ui/react-components';
import { CopyValue, useSiteContext } from '@redactie/utils';
import {
	Field,
	FieldProps,
	Formik,
	FormikValues,
	validateYupSchema,
	yupToFormErrors,
} from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import formRendererConnector from '../../../connectors/formRenderer';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

import DateTimeField from '../../Fields/DateTimeField/DateTimeField';
import { META_VALIDATION_SCHEMA } from './MetaForm.const';

const MetaForm: FC<CompartmentProps> = ({
	contentValue,
	contentType,
	value,
	onChange = () => undefined,
	formikRef,
}): ReactElement | null => {
	const onFormChange = (values: FormikValues, submitForm: () => Promise<void>): void => {
		submitForm();
		onChange(values);
	};
	const { siteId } = useSiteContext();
	const metaValidationSchema = useMemo(() => {
		return META_VALIDATION_SCHEMA(
			siteId,
			contentValue?.uuid,
			undefined,
			contentType?.meta.canBeFiltered
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentValue?.uuid, siteId]);
	const [t] = useCoreTranslation();
	const ErrorMessage = formRendererConnector.api.ErrorMessage;

	/**
	 * RENDER
	 */
	return (
		<Formik
			innerRef={instance => formikRef && formikRef(instance)}
			onSubmit={onChange}
			validate={(values: FormikValues) =>
				// Run like this so that it can handle async
				validateYupSchema(values, metaValidationSchema, false)
					.then(() => ({}))
					.catch(err => yupToFormErrors(err))
			}
			initialValues={value}
		>
			{({ submitForm }) => (
				<CardBody>
					<FormikOnChangeHandler onChange={values => onFormChange(values, submitForm)} />
					<h2 className="h3 u-margin-bottom">Informatie</h2>
					<div className="row">
						{contentValue?.uuid && contentValue.uuid !== 'new' ? (
							<div className="col-xs-12">
								<CopyValue
									label="UUID"
									value={contentValue.uuid}
									buttonText={t(CORE_TRANSLATIONS.GENERAL_COPY)}
								/>
								<p className="u-text-light u-margin-top-xs u-margin-bottom">
									Dit is het unieke identificatienummer van deze pagina. Dit kan
									je niet bewerken.
								</p>
							</div>
						) : null}
					</div>
					{contentType?.meta?.canBeFiltered ? (
						<div className="row">
							<div className="col-xs-12 col-md-6 u-margin-bottom">
								<Field type="text" name="slug.nl" required>
									{(fieldProps: FieldProps<any, {}>) => (
										<>
											<TextField
												loading={fieldProps.form.isValidating}
												placeholder="Typ een slug"
												label="Slug"
												id="slug"
												required
												{...fieldProps.field}
											/>
											{!fieldProps.form.isValidating ? (
												<ErrorMessage name="slug.nl" />
											) : null}
										</>
									)}
								</Field>
								<div className="u-text-light u-margin-top-xs">
									Bepaal de &apos;slug&apos; voor dit content item. Deze wordt
									onder andere gebruikt in de URL.
								</div>
							</div>
						</div>
					) : (
						''
					)}
					<div className="row">
						<div className="col-xs-12">
							<Field
								type="text"
								label="Beschrijving"
								name="description"
								id="description"
								placeholder="Typ een beschrijving."
								as={Textarea}
							/>
							<div className="u-text-light u-margin-top-xs">
								Geef dit item een korte beschrijving voor in het content overzicht.
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 u-margin-top">
							<Field>
								{({ form }: FieldProps) => (
									<DateTimeField
										form={form}
										fieldSchema={{
											name: 'issuedOn',
											module: 'core',
											type: 'string',
											config: {
												inputDescription: '',
												disabled: false,
											},
											dataType: '',
											semanticType: '',
											label: 'Uitgifte op',
										}}
									/>
								)}
							</Field>
						</div>
					</div>
				</CardBody>
			)}
		</Formik>
	);
};

export default MetaForm;
