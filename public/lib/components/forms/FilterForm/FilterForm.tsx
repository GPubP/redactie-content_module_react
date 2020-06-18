import { Datepicker, Select, TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { LoadingState } from '../../../content.types';
import { useContentTypes } from '../../../hooks';
import DataLoader from '../../DataLoader/DataLoader';

import {
	CONTENT_TYPES_DEFAULT_OPTION,
	CONTENT_TYPES_SEARCH_OPTIONS,
	PUBLISHED_DEFAULT_OPTION,
	PUBLISHED_OPTIONS,
	STATUS_DEFAULT_OPTION,
	STATUS_OPTIONS,
} from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	siteId,
	initialState,
	onCancel,
	onSubmit,
	activeFilters,
	deleteActiveFilter,
}) => {
	const [loadingState, contentTypes] = useContentTypes(siteId, CONTENT_TYPES_SEARCH_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	const contentTypeOptions = useMemo(
		() =>
			contentTypes?.data.map(contentType => ({
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
			<Formik enableReinitialize={true} initialValues={initialState} onSubmit={onSubmit}>
				{({ submitForm, setFieldValue, values }) => {
					return (
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
											placeholder="Zoeken op woord, uuid, ..."
											iconright="search"
										/>
									</div>
									<div className="col-xs-12 col-sm-6 u-margin-top">
										<Field
											as={Select}
											label="Content type"
											name="contentType"
											id="contentType"
											options={[
												CONTENT_TYPES_DEFAULT_OPTION,
												...contentTypeOptions,
											]}
										/>
									</div>
									<div className="col-xs-6 col-sm-3 u-margin-top">
										<Field
											as={Datepicker}
											label="Publicatiedatum"
											name="publishedFrom"
											id="publishedFrom"
											format="DD/MM/YYYY"
											mask="99/99/9999"
											activeDate={values.publishedFrom}
											onChange={(value: any) =>
												setFieldValue('publishedFrom', value)
											}
										/>
									</div>
									<div className="col-xs-6 col-sm-3 u-margin-top-lg">
										<Field
											as={Datepicker}
											// NOTE: There is no visible label for this element
											label=""
											name="publishedTo"
											id="publishedTo"
											format="DD/MM/YYYY"
											mask="99/99/9999"
											activeDate={values.publishedTo}
											onChange={(value: any) =>
												setFieldValue('publishedTo', value)
											}
										/>
									</div>
									<div className="col-xs-6 col-sm-3 u-margin-top">
										<Field
											as={Select}
											label="Status"
											name="status"
											id="status"
											options={[STATUS_DEFAULT_OPTION, ...STATUS_OPTIONS]}
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
									<div className="col-xs-12 col-sm-6 u-margin-top">
										<Field
											as={TextField}
											label="Aanmaker"
											name="creator"
											id="creator"
											placeholder="Zoek een persoon"
											iconright="search"
										/>
									</div>
								</div>
							</FilterBody>
						</Filter>
					);
				}}
			</Formik>
		);
	};

	return <DataLoader loadingState={initialLoading} render={renderFilter} />;
};

export default FilterForm;
