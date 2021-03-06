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
import { pathOr } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import { CompartmentProps } from '../../../api/api.types';
import formRendererConnector from '../../../connectors/formRenderer';
import sitesConnector from '../../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { DateTimeField } from '../../Fields/DateTimeField';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

import { META_VALIDATION_SCHEMA } from './MetaForm.const';

const MetaForm: FC<CompartmentProps> = ({
	contentValue,
	contentType,
	value,
	onChange = () => undefined,
	activeLanguage,
	formikRef,
}): ReactElement | null => {
	const onFormChange = (values: FormikValues, submitForm: () => Promise<void>): void => {
		submitForm();
		onChange(values);
	};
	const { siteId } = useSiteContext();

	const modulesConfig = contentType?.modulesConfig?.find(module => {
		return module.site === siteId && module.name === 'navigation';
	});

	const metaValidationSchema = useMemo(() => {
		return META_VALIDATION_SCHEMA(
			siteId,
			contentValue?.meta?.lang,
			contentValue?.uuid,
			undefined,
			contentType?.meta.canBeFiltered,
			modulesConfig
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentValue?.uuid, siteId]);
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const ErrorMessage = formRendererConnector.api.ErrorMessage;
	const [site] = sitesConnector.hooks.useSite(siteId);
	const url =
		typeof site?.data?.url === 'object' ? site?.data?.url[activeLanguage!] : site?.data?.url;

	const newSite = url?.slice(-1) === '/' ? url.slice(0, url.length - 1) : url;

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
			enableReinitialize
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
					<div className="row">
						<div className="col-xs-12 col-md-6 u-margin-bottom">
							URL
							{contentValue?.meta.urlPath ? (
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={`${newSite}${pathOr('', [
										'meta',
										'urlPath',
										contentValue?.meta?.lang,
										'value',
									])(contentValue)}`}
									className="u-margin-left-xs"
								>
									{`${newSite}${pathOr('', [
										'meta',
										'urlPath',
										contentValue?.meta?.lang,
										'value',
									])(contentValue)}`}
								</a>
							) : (
								'-'
							)}
						</div>
					</div>
					{contentType?.meta?.canBeFiltered && !modulesConfig ? (
						<div className="row">
							<div className="col-xs-12 col-md-6 u-margin-bottom">
								<Field
									type="text"
									name={`slug.${contentValue?.meta.lang}`}
									required
								>
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
												<ErrorMessage
													name={`slug.${contentValue?.meta.lang}`}
												/>
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
												inputDescription: contentType.meta.issuedOnEditable
													? tModule(
															MODULE_TRANSLATIONS.ISSUED_ON_HINT_ENABLED
													  )
													: contentType.meta.issuedOnPrefill ===
													  'firstPublication'
													? tModule(
															MODULE_TRANSLATIONS.ISSUED_ON_HINT_DISABLED_FIRST_PUBLISH
													  )
													: tModule(
															MODULE_TRANSLATIONS.ISSUED_ON_HINT_DISABLED_LAST_PUBLISH
													  ),
												disabled: !contentType.meta.issuedOnEditable,
												minuteStep: 1,
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
