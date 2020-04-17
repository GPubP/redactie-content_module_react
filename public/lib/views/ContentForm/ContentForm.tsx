import { Button } from '@acpaas-ui/react-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import NavList from '../../components/NavList/NavList';
import { NavListItem } from '../../components/NavList/NavList.types';
import { getForm } from '../../connectors/formRenderer';
import { getFormPropsByCT } from '../../services/helpers/helpers.service';
import { useExternalCompartmentFacade } from '../../store/api/externalCompartments/externalCompartments.facade';
import { CompartmentType } from '../../store/content/compartments';
import { useCompartmentFacade } from '../../store/content/compartments/compartments.facade';

import { ContentFormMatchProps, ContentFormRouteProps } from './ContentForm.types';

const ContentForm: FC<ContentFormRouteProps<ContentFormMatchProps>> = ({
	contentType,
	onSubmit,
	cancel,
	match,
}) => {
	const { compartment } = match.params;

	/**
	 * Hooks
	 */
	const [{ compartments }, register, activate] = useCompartmentFacade();
	const [externalCompartments] = useExternalCompartmentFacade();
	const [navList, setNavlist] = useState<NavListItem[]>([]);

	useEffect(() => {
		// TODO: add compartments support later on
		if (!contentType) {
			return;
		}

		register(
			[
				{
					label: 'Content',
					name: 'content',
					slug: 'content',
					type: CompartmentType.CT,
				},
				{
					label: 'Meta informatie',
					name: 'meta',
					slug: 'meta',
					type: CompartmentType.INTERNAL,
				},
				...externalCompartments.map(ec => ({
					label: ec.label,
					name: ec.name,
					type: CompartmentType.MODULE,
				})),
			],

			{ replace: true }
		);

		activate(['content', ...externalCompartments.map(ec => ec.name)]);
	}, [contentType, externalCompartments]); // eslint-disable-line

	useEffect(() => {
		setNavlist(
			compartments.map(compartment => ({
				label: compartment.label,
				to: compartment.slug || compartment.name,
			}))
		);
	}, [compartments]);

	/**
	 * Methods
	 */

	/**
	 * RENDER
	 */
	const renderForm = (): ReactElement | null => {
		if (!contentType) {
			return null;
		}

		const Form = getForm();

		if (!Form) {
			return null;
		}

		const formProps = getFormPropsByCT(contentType);

		return (
			<Form {...formProps} onSubmit={onSubmit}>
				{({ submitForm }) => (
					<div className="u-margin-top">
						{compartment}
						<Button
							className="u-margin-right-xs"
							onClick={() => submitForm()}
							type="success"
							htmlType="submit"
						>
							Bewaar
						</Button>
						<Button onClick={cancel} outline>
							Annuleer
						</Button>
					</div>
				)}
			</Form>
		);
	};

	return (
		<>
			<div className="row between-xs top-xs u-margin-bottom-lg">
				<div className="col-xs-3">
					<NavList items={navList} />
				</div>

				<div className="m-card col-xs-9 u-padding">{renderForm()}</div>
			</div>
		</>
	);
};

export default ContentForm;
