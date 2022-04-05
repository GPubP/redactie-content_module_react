import { Autocomplete, Datepicker, Select, TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { DataLoader, LoadingState } from '@redactie/utils';
import { Field, Form, Formik } from 'formik';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { DATE_FORMATS } from '../../../content.const';
import { useContentTypes } from '../../../hooks';

import {
	PUBLISHED_DEFAULT_OPTION,
	PUBLISHED_OPTIONS,
	STATUS_DEFAULT_OPTION,
} from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	activeFilters,
	deleteActiveFilter,
	statusOptions,
	languageOptions,
}) => {
	const [loadingState, contentTypes] = useContentTypes();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	const contentTypeOptions = useMemo(
		() =>
			contentTypes?.map(contentType => ({
				key: contentType.uuid,
				value: contentType?._id,
				label: contentType?.meta.label,
			})),
		[contentTypes]
	);

	const renderFilter = (): ReactElement | null => {
		if (!contentTypes) {
			return null;
		}

		return (
			<Formik enableReinitialize initialValues={initialState} onSubmit={onSubmit}>
				{({ submitForm, setFieldValue, values }) => {
					return (
						<Form>
							<Filter
								title="Filter"
								noFilterText="Geen filters beschikbaar"
								onConfirm={submitForm}
								onClean={onCancel}
								confirmText="Toepassen"
								cleanText="Alles leegmaken"
								activeFilters={activeFilters}
								onFilterRemove={deleteActiveFilter}
							>
								<FilterBody>
									<div className="u-margin-bottom row">
										<div className="col-xs-12 col-sm-6 u-margin-top">
											<Field
												as={TextField}
												label="Zoeken"
												name="search"
												id="search"
												placeholder="Zoeken op titel, slug of uuid."
												iconright="search"
											/>
										</div>
										<div className="col-xs-12 col-sm-6 u-margin-top">
											<Field name="contentType">
												{() => (
													<div className="m-flyout--scrollable">
														<Autocomplete
															key={values.contentTypes}
															label="Content type"
															id="contentTypes"
															defaultValue={values.contentTypes}
															items={contentTypeOptions}
															multipleSelect
															onSelection={(selected: string[]) =>
																setFieldValue(
																	'contentTypes',
																	selected
																)
															}
														/>
													</div>
												)}
											</Field>
										</div>
										<div className="col-xs-6 col-sm-3 u-margin-top">
											<Field
												as={Datepicker}
												label="Laatst bijgewerkt vanaf"
												name="lastModifiedFrom"
												id="lastModifiedFrom"
												format={DATE_FORMATS.date}
												mask="99/99/9999"
												activeDate={values.lastModifiedFrom}
												onChange={(value: any) =>
													setFieldValue('lastModifiedFrom', value)
												}
											/>
										</div>
										<div className="col-xs-6 col-sm-3 u-margin-top">
											<Field
												as={Datepicker}
												label="Tot"
												name="lastModifiedTo"
												id="lastModifiedTo"
												format={DATE_FORMATS.date}
												mask="99/99/9999"
												activeDate={values.lastModifiedTo}
												onChange={(value: any) =>
													setFieldValue('lastModifiedTo', value)
												}
											/>
										</div>
										<div className="col-xs-6 col-sm-3 u-margin-top">
											<Field
												as={Select}
												label="Status"
												name="status"
												id="status"
												options={[STATUS_DEFAULT_OPTION, ...statusOptions]}
											/>
										</div>
										<div className="col-xs-6 col-sm-3 u-margin-top-lg">
											<Field
												as={Select}
												// NOTE: There is no visible label for this element
												label=""
												name="published"
												id="published"
												options={[
													PUBLISHED_DEFAULT_OPTION,
													...PUBLISHED_OPTIONS,
												]}
											/>
										</div>
										<div className="col-sm-12 u-margin-top">
											<Field name="contentType">
												{() => (
													<div className="m-flyout--scrollable">
														<Autocomplete
															key={values.lang}
															label="Taal"
															id="lang"
															defaultValue={values.lang}
															items={languageOptions}
															multipleSelect
															onSelection={(selected: string[]) =>
																setFieldValue('lang', selected)
															}
														/>
													</div>
												)}
											</Field>
										</div>
									</div>
								</FilterBody>
							</Filter>
						</Form>
					);
				}}
			</Formik>
		);
	};

	return <DataLoader loadingState={initialLoading} render={renderFilter} />;
};

export default FilterForm;
