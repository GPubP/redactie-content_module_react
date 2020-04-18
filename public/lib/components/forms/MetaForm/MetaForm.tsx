import { Link, Textarea, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { CompartmentProps } from '../../../api/api.types';
import FormikOnChangeHandler from '../FormikOnChangeHandler/FormikOnChangeHandler';

const MetaForm: FC<CompartmentProps> = ({ contentValue, value, onChange }): ReactElement | null => {
	/**
	 * METHODS
	 */

	/**
	 * RENDER
	 */
	return (
		<Formik onSubmit={onChange} initialValues={value}>
			{({ submitForm }) => (
				<>
					<FormikOnChangeHandler onChange={submitForm} />
					<h5 className="u-margin-bottom">Informatie</h5>
					<p className="u-margin-bottom">Lorem Ipsum.</p>
					<div className="row">
						<div className="col-xs-12 col-md-6 u-margin-bottom">
							<Field
								type="text"
								label="Werktitel"
								name="label"
								id="label"
								placeholder="Typ een label"
								required
								as={TextField}
							/>
							<div className="u-text-light u-margin-top-xs">
								Geef een werktitel op voor dit item.
							</div>
						</div>
						{contentValue?.uuid && contentValue.uuid !== 'new' ? (
							<div className="col-xs-12 col-md-6 u-margin-bottom">
								<label className="a-input__label">UID</label>
								<p className="u-text-light">
									{contentValue?.uuid}
									<CopyToClipboard text={contentValue?.uuid}>
										<Link className="u-margin-left-xs" alt="copy to clipboard">
											kopieer
										</Link>
									</CopyToClipboard>
								</p>
							</div>
						) : null}
					</div>
					<div className="row">
						<div className="col-xs-12 col-md-6 u-margin-bottom">
							<Field
								type="text"
								label="Slug"
								name="slug.nl"
								id="slug"
								placeholder="Typ een slug"
								required
								as={TextField}
							/>
							<div className="u-text-light u-margin-top-xs">
								Bepaal de &apos;slug&apos; voor dit content item. Deze wordt
								ondererandere gebruikt in de URL.
							</div>
						</div>
					</div>
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
				</>
			)}
		</Formik>
	);
};

export default MetaForm;
