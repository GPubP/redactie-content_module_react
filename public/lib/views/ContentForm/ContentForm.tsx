import { Button } from '@acpaas-ui/react-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import NavList from '../../components/NavList/NavList';
import { NavListItem } from '../../components/NavList/NavList.types';
import { getForm } from '../../connectors/formRenderer';
import { MODULE_PATHS } from '../../content.const';
import { getFormPropsByCT } from '../../services/helpers/helpers.service';
import { useExternalCompartmentFacade } from '../../store/api/externalCompartments/externalCompartments.facade';
import { CompartmentType } from '../../store/content/compartments';
import { useCompartmentFacade } from '../../store/content/compartments/compartments.facade';

import {
	CompartmentProps,
	ContentFormMatchProps,
	ContentFormRouteProps,
} from './ContentForm.types';

const ContentForm: FC<ContentFormRouteProps<ContentFormMatchProps>> = ({
	history,
	contentType,
	onSubmit,
	cancel,
	match,
}) => {
	const { compartment } = match.params;

	const renderMetaForm: FC<CompartmentProps> = (): ReactElement => <>meta hello!!!</>;
	const renderForm: FC<CompartmentProps> = (): ReactElement | null => {
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

	/**
	 * Hooks
	 */
	const [
		{ compartments, active: activeCompartment },
		register,
		activate,
	] = useCompartmentFacade();
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
					component: renderForm,
					type: CompartmentType.CT,
				},
				{
					label: 'Meta informatie',
					name: 'meta',
					slug: 'meta',
					component: renderMetaForm,
					type: CompartmentType.INTERNAL,
				},
				...externalCompartments.map(ec => ({
					label: ec.label,
					name: ec.name,
					component: ec.component,
					type: CompartmentType.MODULE,
				})),
			],

			{ replace: true }
		);
	}, [contentType, externalCompartments]); // eslint-disable-line

	useEffect(() => {
		if (compartments.length && (!compartment || compartment === 'default')) {
			history.push(`./${compartments[0].name}`);
			return;
		}

		activate(compartment);
	}, [activate, compartment, compartments, history]);

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
	const renderCompartment = (): any =>
		activeCompartment?.component({
			contentType,
			contentVaue: {} as any,
			isValid: true,
			settings: {} as any,
			onChange: () => console.log('changed') as any,
			value: {},
			updateContent: () => console.log('update content') as any,
		});

	return (
		<>
			<div className="row between-xs top-xs u-margin-bottom-lg">
				<div className="col-xs-3">
					<NavList items={navList} />
				</div>

				<div className="m-card col-xs-9 u-padding">{renderCompartment()}</div>
			</div>
		</>
	);
};

export default ContentForm;
