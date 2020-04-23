import { TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { FILTER_FORM_VALIDATION_SCHEMA } from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	activeFilters,
	deleteActiveFilter,
}) => {
	return (
		<>
			<Formik initialValues={initialState} onSubmit={onSubmit}>
				{({ submitForm }) => {
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
								<div className="col-xs-12 col-sm-6 u-margin-top">
									<Field
										as={TextField}
										label="Zoeken"
										name="search"
										id="Zoeken"
										placeholder="Zoeken op woord, uuid, ..."
										iconright="search"
									/>
								</div>
								<div className="col-xs-12 col-sm-6 u-margin-top">
									<Field
										as={TextField}
										label="Content type"
										name="contentType"
										id="Content type"
										placeholder="Zoek een content type"
										iconright="search"
									/>
								</div>
								<div className="col-xs-12 col-sm-6 u-margin-top">
									<Field
										as={TextField}
										label="Aanmaker"
										name="author"
										id="Aanmaker"
										placeholder="Zoek een persoon"
										iconright="search"
									/>
								</div>
								<div className="col-xs-12 col-sm-6 u-margin-top">
									<Field
										as={TextField}
										label="Thema"
										name="theme"
										id="Thema"
										placeholder="Zoek een thema"
										iconright="search"
									/>
								</div>
							</FilterBody>
						</Filter>
					);
				}}
			</Formik>
		</>
	);
};

export default FilterForm;
