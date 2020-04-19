import { Button } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { clone, compose, find, pick } from 'ramda';
import React, { FC, useEffect, useState } from 'react';

import { ContentSchema } from '../../api/api.types';
import { FieldsForm, MetaForm } from '../../components';
import NavList from '../../components/NavList/NavList';
import { NavListItem } from '../../components/NavList/NavList.types';
import {
	filterCompartments,
	getCompartmentValue,
	getSettings,
} from '../../helpers/contentCompartments';
import { useExternalCompartmentFacade } from '../../store/api/externalCompartments/externalCompartments.facade';
import { CompartmentType, ContentCompartmentModel } from '../../store/content/compartments';
import { useCompartmentFacade } from '../../store/content/compartments/compartments.facade';
import { useInternalFacade } from '../../store/content/internal/internal.facade';

import { ContentFormMatchProps, ContentFormRouteProps } from './ContentForm.types';

const ContentForm: FC<ContentFormRouteProps<ContentFormMatchProps>> = ({
	history,
	contentType,
	onSubmit,
	cancel,
	match,
}) => {
	const { compartment } = match.params;

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
	const [{ active: localContent }, registerContent] = useInternalFacade();

	useEffect(() => {
		// TODO: add compartments support later on
		if (!contentType) {
			return;
		}

		register(
			[
				{
					label: 'Inhoud',
					name: 'fields',
					slug: 'inhoud',
					component: FieldsForm,
					type: CompartmentType.CT,
				},
				{
					label: 'Informatie',
					name: 'meta',
					slug: 'informatie',
					component: MetaForm,
					type: CompartmentType.INTERNAL,
				},
				...filterCompartments(localContent, contentType, externalCompartments),
			],

			{ replace: true }
		);
	}, [contentType, externalCompartments]); // eslint-disable-line

	useEffect(() => {
		if (compartments.length && (!compartment || compartment === 'default')) {
			history.push(`./${compartments[0].slug || compartments[0].name}`);
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
	const handleChange = (compartment: ContentCompartmentModel, values: unknown): void => {
		if (!localContent) {
			return;
		}

		switch (compartment.type) {
			case CompartmentType.CT:
				registerContent([{ ...localContent, fields: values as ContentSchema['fields'] }]);
				break;
			case CompartmentType.INTERNAL:
				registerContent([
					{
						...localContent,
						meta: { ...localContent.meta, ...(values as ContentSchema['meta']) },
					},
				]);
				break;
			case CompartmentType.MODULE:
				registerContent([
					{
						...localContent,
						modulesData: {
							...localContent.modulesData,
							[compartment.name]: values as any,
						},
					},
				]);
				break;
		}

		return;
	};

	/**
	 * RENDER
	 */
	return (
		<>
			<Container>
				<div className="row between-xs top-xs u-margin-bottom-lg">
					<div className="col-xs-3">
						<NavList items={navList} />
					</div>

					<div className="m-card col-xs-9 u-padding">
						<div className="u-margin">
							{activeCompartment ? (
								<activeCompartment.component
									contentType={clone(contentType)}
									contentValue={clone(localContent)}
									isValid={true}
									settings={getSettings(contentType, activeCompartment)}
									onChange={values => handleChange(activeCompartment, values)}
									value={getCompartmentValue(localContent, activeCompartment)}
									updateContent={(content: ContentSchema) =>
										registerContent([content])
									}
								/>
							) : null}
						</div>
					</div>
				</div>
			</Container>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button
							className="u-margin-right-xs"
							onClick={() => (localContent ? onSubmit(localContent) : null)}
							type="success"
							htmlType="submit"
						>
							Bewaar
						</Button>
						<Button onClick={cancel} outline>
							Annuleer
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);
};

export default ContentForm;
